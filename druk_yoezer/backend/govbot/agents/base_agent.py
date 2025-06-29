"""
Base Agent class for GovBot Bhutan
Provides common functionality for all specialized agents
"""

import logging
from typing import Dict, List, Any, Optional
from abc import ABC, abstractmethod

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..llm_client import LLMClient
from ..types import AgentResult

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all GovBot agents"""
    
    def __init__(self, rag_system: RAGSystem, agent_name: str):
        self.rag_system = rag_system
        self.llm_client = LLMClient()
        self.agent_name = agent_name
        self.initialized = False
        
    async def initialize(self):
        """Initialize the agent"""
        logger.info(f"Initializing {self.agent_name}...")
        await self.llm_client.initialize()
        self.initialized = True
        logger.info(f"✅ {self.agent_name} initialized")
    
    @abstractmethod
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process a query - must be implemented by subclasses"""
        pass
    
    async def search_and_generate_response(
        self,
        query: str,
        user_profile: Optional[UserProfile] = None,
        category_filter: Optional[str] = None,
        n_results: int = 3
    ) -> AgentResult:
        """Common method to search documents and generate LLM response"""
        
        try:
            # Search for relevant documents
            documents = await self.rag_system.search_documents(
                query, 
                n_results=n_results,
                category_filter=category_filter
            )
            
            if not documents:
                # Generate response without documents
                response = await self.llm_client.generate_response(
                    query,
                    system_message=self._get_system_message(user_profile),
                    max_tokens=1000
                )
                
                return AgentResult(
                    response=response,
                    confidence_score=0.4,
                    sources=[],
                    reasoning="No relevant documents found, generated general response"
                )
            
            # Generate response based on documents
            response = await self.llm_client.summarize_documents(documents, query)
            
            # Add agent-specific enhancements
            enhanced_response = self._enhance_response(response, user_profile, documents)
            
            # Calculate confidence based on document relevance
            avg_relevance = sum(doc.get("relevance_score", 0) for doc in documents) / len(documents)
            confidence = min(0.9, avg_relevance + 0.1)
            
            return AgentResult(
                response=enhanced_response,
                confidence_score=confidence,
                sources=documents,
                reasoning=f"Found {len(documents)} relevant documents and generated LLM response"
            )
            
        except Exception as e:
            logger.error(f"{self.agent_name} processing failed: {e}")
            
            # Fallback response
            fallback_response = await self.llm_client.generate_response(
                query,
                system_message=self._get_system_message(user_profile),
                max_tokens=800
            )
            
            return AgentResult(
                response=fallback_response,
                confidence_score=0.3,
                sources=[],
                reasoning=f"Processing error, used fallback LLM response: {str(e)}"
            )
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get system message for LLM - can be overridden by subclasses"""
        
        base_message = f"""You are {self.agent_name} for GovBot Bhutan, specializing in Bhutanese government services. 

Key principles:
- Provide accurate, helpful information about Bhutan's government services
- Respect Gross National Happiness (GNH) principles
- Be culturally sensitive and respectful
- Guide users to appropriate government departments
- Use clear, professional language
- Include practical next steps when possible"""

        if user_profile:
            user_context = f"\n\nUser Profile: {user_profile.user_type.value}"
            if user_profile.location:
                user_context += f", Location: {user_profile.location}"
            if user_profile.business_sector:
                user_context += f", Business Sector: {user_profile.business_sector}"
            
            base_message += user_context
        
        return base_message
    
    def _enhance_response(
        self, 
        response: str, 
        user_profile: Optional[UserProfile],
        documents: List[Dict[str, Any]]
    ) -> str:
        """Enhance the LLM response with agent-specific information"""
        
        # Add department contact information if available
        departments = set()
        for doc in documents:
            if doc.get("department"):
                departments.add(doc["department"])
        
        if departments:
            response += f"\n\n**Relevant Departments:**\n"
            for dept in departments:
                response += f"• {dept}\n"
        
        # Add cultural note
        response += f"\n\n**Note:** This guidance is provided in the spirit of Gross National Happiness, Bhutan's unique development philosophy that prioritizes collective well-being alongside economic progress."
        
        return response
