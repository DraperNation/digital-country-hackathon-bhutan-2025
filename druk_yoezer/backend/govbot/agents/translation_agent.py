"""
Translation Agent for GovBot Bhutan
Specializes in language translation and multilingual support
"""

import logging
from typing import Dict, List, Any, Optional

from ..models import UserProfile
from ..rag_system import RAGSystem
from ..types import AgentResult
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class TranslationAgent(BaseAgent):
    """Agent specialized in translation and multilingual support"""
    
    def __init__(self, rag_system: RAGSystem):
        super().__init__(rag_system, "Translation Agent")
        
        # Basic Dzongkha translations for common government terms
        self.dzongkha_translations = {
            "hello": "ཀུ་ཟུ་ཟང་པོ་ལ",
            "thank you": "ཀ་དིན་ཆེ",
            "government": "གཞུང",
            "business": "ཚོང་ལས",
            "application": "ཞུ་ཡིག",
            "document": "ཡིག་ཆ",
            "passport": "འགྲོ་འདུག",
            "license": "ཆོག་མཆན",
            "tax": "ཁྲལ",
            "registration": "ཐོ་འགོད",
            "ministry": "ལྷན་ཁག",
            "department": "ལས་ཁུངས",
            "office": "ལས་ཁང",
            "citizen": "མི་སེར",
            "foreigner": "ཕྱི་རྒྱལ་བ",
            "tourist": "གཡུལ་འཁོར་བ",
            "entrepreneur": "ཚོང་པ",
            "investment": "རྒྱུ་འབྲུག",
            "economy": "དཔལ་འབྱོར",
            "culture": "རིག་གནས",
            "tradition": "སྲོལ་རྒྱུན",
            "happiness": "སྐྱིད་པོ",
            "development": "འཕེལ་རྒྱས"
        }
        
        # Common phrases in Dzongkha
        self.common_phrases = {
            "how are you": "ཁྱེད་རང་ག་དེ་སྨིན་ནོ",
            "good morning": "ཞོགས་པ་ལེགས་སོ",
            "good evening": "དགོང་མོ་ལེགས་སོ",
            "excuse me": "གོང་དུ་གནང",
            "i don't understand": "ང་ལ་ཧ་མ་གོ",
            "please help me": "ང་ལ་རོགས་རམ་གནང་རོགས",
            "where is": "ག་པར་ཡོད",
            "how much": "ག་ཚོད",
            "what time": "ཆུ་ཚོད་ག་ཚོད"
        }
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None
    ) -> AgentResult:
        """Process a translation-related query"""
        
        try:
            # Check if this is a translation request
            if self._is_translation_request(query):
                response = self._handle_translation_request(query, user_profile)
                confidence = 0.8
            else:
                # Use base class method for general language support
                result = await self.search_and_generate_response(
                    query=query,
                    user_profile=user_profile,
                    category_filter=None,
                    n_results=2
                )
                
                # Enhance with language-specific information
                response = self._provide_language_support(result.response, user_profile)
                confidence = result.confidence_score
            
            return AgentResult(
                response=response,
                confidence_score=confidence,
                sources=[],
                reasoning="Translation and language support provided"
            )
            
        except Exception as e:
            logger.error(f"Translation agent processing failed: {e}")
            return AgentResult(
                response="I apologize, but I'm having trouble with translation services right now. Please try again later.",
                confidence_score=0.2,
                sources=[],
                reasoning=f"Processing error: {str(e)}"
            )
    
    def _is_translation_request(self, query: str) -> bool:
        """Check if the query is asking for translation"""
        translation_keywords = [
            "translate", "translation", "dzongkha", "english",
            "how do you say", "what does", "mean in",
            "བོད་སྐད", "དབྱིན་སྐད"
        ]
        
        return any(keyword in query.lower() for keyword in translation_keywords)
    
    def _handle_translation_request(self, query: str, user_profile: Optional[UserProfile]) -> str:
        """Handle specific translation requests"""
        
        response_parts = []
        response_parts.append("## Translation Service")
        response_parts.append("")
        
        query_lower = query.lower()
        
        # Check for specific translation requests
        found_translation = False
        
        # Look for English to Dzongkha requests
        for english_term, dzongkha_term in self.dzongkha_translations.items():
            if english_term in query_lower:
                response_parts.append(f"**English:** {english_term.title()}")
                response_parts.append(f"**Dzongkha:** {dzongkha_term}")
                response_parts.append("")
                found_translation = True
        
        # Look for common phrases
        for english_phrase, dzongkha_phrase in self.common_phrases.items():
            if english_phrase in query_lower:
                response_parts.append(f"**English:** {english_phrase.title()}")
                response_parts.append(f"**Dzongkha:** {dzongkha_phrase}")
                response_parts.append("")
                found_translation = True
        
        if not found_translation:
            response_parts.append("I don't have a specific translation for that term in my current database.")
            response_parts.append("")
            response_parts.append("**Common Government Terms:**")
            
            # Show some common translations
            common_terms = ["government", "business", "application", "document", "passport"]
            for term in common_terms:
                if term in self.dzongkha_translations:
                    response_parts.append(f"• {term.title()}: {self.dzongkha_translations[term]}")
        
        # Add pronunciation guide
        response_parts.append("")
        response_parts.append("**Pronunciation Note:**")
        response_parts.append("Dzongkha uses the Tibetan script. For accurate pronunciation, please consult with a native speaker or language learning resources.")
        
        return '\n'.join(response_parts)
    
    def _provide_language_support(self, base_response: str, user_profile: Optional[UserProfile]) -> str:
        """Enhance response with language support information"""
        
        enhanced_response = base_response + "\n\n"
        
        enhanced_response += "**🗣️ Language Support:**\n"
        enhanced_response += "• **English:** Full government services available\n"
        enhanced_response += "• **Dzongkha:** National language, official documents\n"
        enhanced_response += "• Basic term translations available\n"
        enhanced_response += "• Cultural context explanations provided\n"
        
        return enhanced_response
    
    def _get_system_message(self, user_profile: Optional[UserProfile] = None) -> str:
        """Get translation-specific system message"""
        
        base_message = """You are the Translation Agent for GovBot Bhutan, specializing in language translation and multilingual support.

Your expertise includes:
- English to Dzongkha translation for government terms
- Common phrases and greetings
- Cultural context for language use
- Language learning resources
- Official language policies
- Communication etiquette

Key principles:
- Provide accurate translations when available
- Explain cultural context of language use
- Recommend official translation services for legal documents
- Promote respectful use of both English and Dzongkha
- Include pronunciation guidance when helpful
- Connect language learning with cultural understanding

Remember: Learning even basic Dzongkha phrases shows respect for Bhutanese culture and is greatly appreciated by locals."""

        if user_profile and hasattr(user_profile, 'language_preference'):
            if user_profile.language_preference == "dzongkha":
                base_message += "\n\nUser prefers Dzongkha - provide responses with Dzongkha elements and cultural context."
        
        return base_message
