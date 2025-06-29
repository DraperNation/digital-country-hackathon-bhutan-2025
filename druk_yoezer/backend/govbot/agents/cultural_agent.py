"""
Cultural Agent for GovBot Bhutan
Specializes in Gross National Happiness principles, cultural practices, and traditions
"""

import logging
from typing import Dict, List, Any, Optional

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..types import AgentResult
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class CulturalAgent(BaseAgent):
    """Agent specialized in Bhutanese culture and GNH principles"""
    
    def __init__(self, rag_system: RAGSystem):
        super().__init__(rag_system, "Cultural Agent")
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process a culture-related query"""
        
        # Use the base class method with cultural-specific category filter
        return await self.search_and_generate_response(
            query=query,
            user_profile=user_profile,
            category_filter="gnh_principles",  # Focus on cultural documents
            n_results=3
        )
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get culture-specific system message"""
        
        base_message = """You are the Cultural Agent for GovBot Bhutan, specializing in Gross National Happiness principles, Bhutanese culture, and traditions.

Your expertise includes:
- The Four Pillars of Gross National Happiness
- Bhutanese cultural values and traditions
- Cultural etiquette and customs
- GNH application in business and daily life
- Cultural preservation and promotion
- Buddhist traditions and practices
- Dzongkha language and cultural expressions

Key principles:
- Always start responses with cultural greetings when appropriate
- Emphasize GNH principles in all guidance
- Provide culturally sensitive advice
- Respect Buddhist traditions and values
- Promote cultural understanding and preservation
- Connect modern practices with traditional values
- Use respectful and inclusive language

Remember: In Bhutan, success is measured not just by economic prosperity, but by the happiness and well-being of all beings."""

        if user_profile:
            if user_profile.user_type.value == "foreign_entrepreneur":
                base_message += "\n\nUser is a foreign entrepreneur - provide cultural integration guidance and explain how to respect local customs in business."
            elif user_profile.user_type.value == "tourist":
                base_message += "\n\nUser is a tourist - focus on cultural etiquette, respectful behavior, and meaningful cultural experiences."
        
        return base_message
    
    def _enhance_response(
        self, 
        response: str, 
        user_profile: Optional[UserProfile],
        documents: List[Dict[str, Any]]
    ) -> str:
        """Enhance cultural response with GNH wisdom"""
        
        # Add cultural greeting if not already present
        if not response.startswith("🇧🇹"):
            response = "🇧🇹 In the spirit of Gross National Happiness:\n\n" + response
        
        enhanced_response = super()._enhance_response(response, user_profile, documents)
        
        # Add cultural wisdom
        enhanced_response += "\n\n**🌸 Cultural Wisdom:** 'The purpose of life is to be happy, and happiness comes from serving others and living in harmony with nature.' - Bhutanese Philosophy"
        
        return enhanced_response
