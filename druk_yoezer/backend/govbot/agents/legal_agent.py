"""
Legal Agent for GovBot Bhutan
Specializes in legal requirements, regulations, and compliance matters
"""

import logging
from typing import Dict, List, Any, Optional

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..types import AgentResult
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class LegalAgent(BaseAgent):
    """Agent specialized in legal and regulatory matters for Bhutan"""
    
    def __init__(self, rag_system: RAGSystem):
        super().__init__(rag_system, "Legal Agent")
        
        # Legal knowledge base
        self.legal_frameworks = {
            "business_law": {
                "foreign_investment": ["Companies Act", "Foreign Direct Investment Policy"],
                "licensing": ["Business Licensing Act", "Trade License Rules"],
                "taxation": ["Income Tax Act", "Goods and Services Tax Act"]
            },
            "immigration_law": {
                "eresidency": ["Immigration Act", "eResidency Guidelines"],
                "work_permits": ["Labour and Employment Act", "Work Permit Rules"]
            },
            "environmental_law": {
                "clearances": ["Environmental Assessment Act", "Forest and Nature Conservation Act"],
                "sustainability": ["National Environment Protection Act"]
            }
        }
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process a legal-related query"""
        
        # Use the base class method with legal-specific category filter
        return await self.search_and_generate_response(
            query=query,
            user_profile=user_profile,
            category_filter="business_registration",  # Focus on legal documents
            n_results=3
        )
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get legal-specific system message"""
        
        base_message = """You are the Legal Agent for GovBot Bhutan, specializing in Bhutanese legal requirements, regulations, and compliance matters.

Your expertise includes:
- Business registration and licensing requirements
- Foreign investment regulations
- Tax law and compliance
- Immigration and work permit laws
- Environmental regulations
- Legal procedures and documentation

Key principles:
- Provide accurate legal guidance based on Bhutanese law
- Always recommend consulting with relevant government departments for authoritative advice
- Include specific requirements, processes, and timelines
- Mention applicable laws and regulations
- Be clear about compliance obligations
- Respect GNH principles in legal interpretations

Important: Always include a disclaimer that this is guidance only and users should consult with relevant departments or legal professionals for authoritative advice."""

        if user_profile:
            if user_profile.user_type.value == "foreign_entrepreneur":
                base_message += "\n\nUser is a foreign entrepreneur - focus on foreign investment laws, partnership requirements, and compliance obligations."
            elif user_profile.user_type.value == "local_business":
                base_message += "\n\nUser is a local business owner - focus on domestic business regulations and local compliance requirements."
        
        return base_message
    
    def _enhance_response(
        self, 
        response: str, 
        user_profile: Optional[UserProfile],
        documents: List[Dict[str, Any]]
    ) -> str:
        """Enhance legal response with specific legal guidance"""
        
        enhanced_response = super()._enhance_response(response, user_profile, documents)
        
        # Add legal disclaimer
        enhanced_response += "\n\n**⚖️ Legal Disclaimer:** This information is for guidance only. Please consult with the relevant government department or a qualified legal professional for authoritative advice specific to your situation."
        
        # Add compliance reminder
        enhanced_response += "\n\n**📋 Compliance Note:** Ensure all legal requirements are met and stay updated with any changes in regulations."
        
        return enhanced_response
