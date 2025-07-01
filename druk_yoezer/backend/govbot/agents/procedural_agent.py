"""
Procedural Agent for GovBot Bhutan
Specializes in step-by-step processes, applications, and administrative procedures
"""

import logging
from typing import Dict, List, Any, Optional

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..types import AgentResult
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class ProceduralAgent(BaseAgent):
    """Agent specialized in government procedures and processes"""
    
    def __init__(self, rag_system: RAGSystem):
        super().__init__(rag_system, "Procedural Agent")
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process a procedure-related query"""
        
        # Use the base class method without category filter for broader search
        return await self.search_and_generate_response(
            query=query,
            user_profile=user_profile,
            category_filter=None,  # Search all categories for procedures
            n_results=4
        )
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get procedure-specific system message"""
        
        base_message = """You are the Procedural Agent for GovBot Bhutan, specializing in step-by-step government processes, applications, and administrative procedures.

Your expertise includes:
- Government application processes
- Document requirements and preparation
- Step-by-step procedural guidance
- Processing times and timelines
- Fee structures and payment methods
- Required forms and documentation
- Department contacts and locations
- Online vs. offline procedures

Key principles:
- Always provide clear, step-by-step instructions
- Include all required documents and forms
- Mention processing times and fees
- Provide department contact information
- Explain both online and offline options
- Include helpful tips and best practices
- Warn about common pitfalls or delays
- Structure information logically and clearly

Format responses with:
1. Clear step-by-step processes
2. Required documents section
3. Fees and timeline information
4. Contact department details
5. Helpful tips and reminders"""

        if user_profile:
            if user_profile.user_type.value == "foreign_entrepreneur":
                base_message += "\n\nUser is a foreign entrepreneur - include additional requirements for foreign applicants and translation needs."
            elif user_profile.user_type.value == "citizen":
                base_message += "\n\nUser is a Bhutanese citizen - focus on citizen-specific procedures and requirements."
        
        return base_message
    
    def _enhance_response(
        self, 
        response: str, 
        user_profile: Optional[UserProfile],
        documents: List[Dict[str, Any]]
    ) -> str:
        """Enhance procedural response with helpful tips"""
        
        enhanced_response = super()._enhance_response(response, user_profile, documents)
        
        # Add procedural tips
        enhanced_response += "\n\n**💡 Helpful Tips:**"
        enhanced_response += "\n• Submit applications well before deadlines"
        enhanced_response += "\n• Keep copies of all submitted documents"
        enhanced_response += "\n• Follow up if you don't receive confirmation within expected timeframes"
        enhanced_response += "\n• Contact the relevant department if you have questions"
        
        return enhanced_response
