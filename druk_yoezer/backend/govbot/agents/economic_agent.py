"""
Economic Agent for GovBot Bhutan
Specializes in economic policies, taxation, business incentives, and financial matters
"""

import logging
from typing import Dict, List, Any, Optional

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..types import AgentResult
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class EconomicAgent(BaseAgent):
    """Agent specialized in economic and financial matters"""
    
    def __init__(self, rag_system: RAGSystem):
        super().__init__(rag_system, "Economic Agent")
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process an economics-related query"""
        
        # Use the base class method with economic-specific category filter
        return await self.search_and_generate_response(
            query=query,
            user_profile=user_profile,
            category_filter="taxation",  # Focus on economic documents
            n_results=3
        )
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get economics-specific system message"""
        
        base_message = """You are the Economic Agent for GovBot Bhutan, specializing in economic policies, taxation, business incentives, and financial matters.

Your expertise includes:
- Tax rates and structures (corporate, personal, GST)
- Business investment requirements
- Economic incentives and benefits
- GNH-based economic policies
- Foreign investment regulations
- Digital economy provisions
- Currency and financial regulations
- Economic development programs

Key principles:
- Provide accurate financial and tax information
- Explain economic policies in the context of GNH
- Include specific rates, thresholds, and calculations
- Mention available incentives and benefits
- Connect economic policies to sustainable development
- Always recommend consulting with tax professionals for specific advice
- Include both local and foreign business considerations
- Explain the unique aspects of Bhutan's GNH-based economy

Format responses with:
1. Specific rates and figures
2. Eligibility criteria
3. Application processes
4. Benefits and incentives
5. Important deadlines and compliance requirements"""

        if user_profile:
            if user_profile.user_type.value == "foreign_entrepreneur":
                base_message += "\n\nUser is a foreign entrepreneur - focus on foreign investment requirements, tax implications, and eResidency benefits."
            elif user_profile.user_type.value == "local_business":
                base_message += "\n\nUser is a local business owner - emphasize local business benefits, GNH certification advantages, and domestic economic opportunities."
        
        return base_message
    
    def _enhance_response(
        self, 
        response: str, 
        user_profile: Optional[UserProfile],
        documents: List[Dict[str, Any]]
    ) -> str:
        """Enhance economic response with financial guidance"""
        
        enhanced_response = super()._enhance_response(response, user_profile, documents)
        
        # Add economic context
        enhanced_response += "\n\n**💰 Economic Context:** Bhutan's economy is uniquely guided by Gross National Happiness principles, balancing economic growth with environmental sustainability, cultural preservation, and good governance."
        
        # Add professional advice disclaimer
        enhanced_response += "\n\n**📊 Professional Advice:** Tax rates and economic policies may change. Please consult with the Department of Revenue and Customs or a qualified financial professional for current and specific advice."
        
        return enhanced_response
