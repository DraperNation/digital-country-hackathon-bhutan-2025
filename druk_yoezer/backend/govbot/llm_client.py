"""
LLM Client for GovBot Bhutan
Handles interactions with various LLM providers
"""

import os
import logging
from typing import Dict, List, Any, Optional
import asyncio
from dotenv import load_dotenv
load_dotenv() 
api_key = os.getenv("OPEN_AI_API_KEY")

# Try to import OpenAI, but make it optional
try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

logger = logging.getLogger(__name__)

class LLMClient:
    """Client for interacting with Language Models"""
    
    def __init__(self):
        self.openai_client = None
        self.model_name = "gpt-4o-mini-2024-07-18"  # Default model
        self.initialized = False
        
    async def initialize(self):
        """Initialize the LLM client"""
        logger.info("Initializing LLM Client...")
        
        # Try to initialize OpenAI client
        openai_api_key = os.getenv("OPEN_AI_API_KEY")
        
        if OPENAI_AVAILABLE and openai_api_key:
            try:
                self.openai_client = AsyncOpenAI(api_key=openai_api_key)
                self.model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                logger.info(f"✅ OpenAI client initialized with model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")
                self.openai_client = None
        else:
            logger.warning("OpenAI not available - API key missing or package not installed")
        
        self.initialized = True
        logger.info("✅ LLM Client initialized")

    async def generate_response(
        self, 
        prompt: str, 
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> str:
        """Generate a response using the available LLM"""
        
        if not self.initialized:
            await self.initialize()
        
        # Try OpenAI first
        if self.openai_client:
            try:
                messages = []
                
                if system_message:
                    messages.append({"role": "system", "content": system_message})
                
                messages.append({"role": "user", "content": prompt})
                
                response = await self.openai_client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                
                return response.choices[0].message.content.strip()
                
            except Exception as e:
                logger.error(f"OpenAI API call failed: {e}")
                # Fall back to mock response
                return self._generate_mock_response(prompt)
        
        # Fallback to mock response if no LLM available
        return self._generate_mock_response(prompt)
    
    def _generate_mock_response(self, prompt: str) -> str:
        """Generate a natural, conversational response when no LLM is available"""
        
        prompt_lower = prompt.lower()
        
        # Business registration queries
        if any(word in prompt_lower for word in ["business", "company", "register", "start"]):
            if "foreign" in prompt_lower or "entrepreneur" in prompt_lower:
                return """Ah, you're looking to start a business here in Bhutan as a foreign entrepreneur! That's exciting. 

The process has gotten much smoother recently. You'll need a minimum investment - it's USD 250,000 for manufacturing or USD 500,000 for services. The tricky part is you'll need a local partner who holds at least 51% ownership.

Here's what I'd suggest: First, get your business plan ready and find a reliable Bhutanese partner. Then head to the Department of Industry with your documents. They're pretty helpful there, especially if you show how your business aligns with our GNH principles.

The whole process usually takes about a month to six weeks if everything's in order. Oh, and don't forget the environmental clearance if you're doing anything manufacturing-related.

Want me to walk you through the specific documents you'll need?"""
            
            else:
                return """Starting a business here? Good for you! 

For local businesses, the process is much more straightforward than for foreign investors. You'll mainly need to deal with your local Dzongkhag office for the trade license and get registered with the Department of Revenue for taxes.

The investment requirements are much lower for locals, and you don't need the foreign partnership requirements. Most of my friends who started businesses said the hardest part was just getting all the paperwork together in one place.

Have you thought about what kind of business you want to start? That'll determine which specific permits you need."""

        # eResidency queries
        elif "eresidency" in prompt_lower or "e-residency" in prompt_lower or "digital nomad" in prompt_lower:
            return """The eResidency program is actually pretty cool! I know several people who've gone through it.

You need to show you're making at least USD 50,000 annually and have a clean background. The application is all online initially, but you'll need to do a video interview with immigration officials - they're quite thorough but fair.

What's interesting is the cultural orientation part. It's not just a formality - they really want you to understand our way of life here. Some applicants found it challenging, but most say it helped them integrate better.

The annual fee is USD 1,000, which isn't cheap, but you get access to digital government services and can register businesses remotely. Plus, there are some nice tax advantages for the first few years.

Are you currently working remotely, or are you planning to start a digital business here?"""

        # Tax-related queries
        elif any(word in prompt_lower for word in ["tax", "taxation", "gst", "income tax"]):
            return """Taxes here can be a bit confusing at first, but once you get the hang of it, it's not too bad.

Corporate tax is 25%, but here's the thing - if you get GNH certification for your business, it drops to 15%. That's a pretty big incentive to align with our happiness principles!

For individuals, we have progressive rates from 0% to 25%. If you're here less than 183 days a year, your foreign income isn't taxed, which is great for digital nomads.

GST is 12% on most things, but there are exemptions for essential items. The Department of Revenue and Customs has gotten much better with their online systems recently.

One tip: keep really good records. The tax officers are generally helpful, but they do like their documentation proper.

What's your specific tax situation? Are you looking at personal or business taxes?"""

        # Cultural/GNH queries
        elif any(word in prompt_lower for word in ["culture", "gnh", "happiness", "tradition", "custom"]):
            return """You're asking about something really close to our hearts here!

GNH isn't just a government policy - it's genuinely how we try to live. The four pillars aren't abstract concepts; they guide real decisions. When businesses apply for licenses, we actually look at how they'll contribute to community well-being, not just profits.

For visitors, the most important thing is respect. When you visit dzongs, dress modestly and follow the guidelines. Don't point your feet toward altars, and always ask before taking photos of people.

If you're doing business here, showing that you understand and respect our values goes a long way. It's not about being perfect - it's about making an effort to understand why we do things differently.

The cultural orientation programs are actually quite good if you want to learn more deeply. Many foreigners say it changed how they think about success and happiness.

What aspect of our culture are you most curious about?"""

        # Tourism and cultural etiquette
        elif any(word in prompt_lower for word in ["tourist", "visit", "dzong", "festival", "etiquette"]):
            return """Welcome to Bhutan! Or welcome soon, I should say.

The most important thing is respect - for our traditions, our sacred places, and our way of life. When visiting dzongs, dress conservatively (long pants, covered shoulders), remove your hat, and don't take photos inside without permission.

During festivals, you're welcome to watch and even participate in some dances, but follow the locals' lead. Don't push to the front for photos - the spiritual aspect is more important than getting the perfect shot.

Photography is generally okay in public spaces, but always ask before photographing people, especially monks or during religious ceremonies. Some places have restrictions, so check with your guide.

Our "high value, low impact" tourism policy means we want you to have meaningful experiences, not just tick boxes. Take time to talk with locals, learn about our customs, maybe try some traditional crafts.

What kind of experiences are you hoping to have here?"""

        # Passport and citizen services
        elif any(word in prompt_lower for word in ["passport", "renewal", "citizen", "document"]):
            return """Passport renewals have gotten much easier with the online system!

You can start the application online, which saves a lot of time. Just make sure you have your current passport, citizenship certificate, and recent photos ready. The whole process takes about a week to ten days if you don't need it rushed.

If you need it urgently, they can do it in 24-48 hours, but there's an extra fee. Most people find the regular processing time is fine unless you have sudden travel plans.

The immigration office in Thimphu is pretty efficient now. If you're in other dzongkhags, you might need to coordinate with the local office first.

One thing - make sure your photos meet the specifications exactly. They're quite strict about that, and it's the most common reason for delays.

Is this for regular renewal, or do you have urgent travel coming up?"""

        # General government services
        elif any(word in prompt_lower for word in ["government", "service", "office", "department"]):
            return """Government services have really improved over the past few years, especially with digitization.

Most basic services can be started online now, though you might still need to visit offices for final steps. The staff are generally helpful, but like anywhere, some offices are more efficient than others.

Thimphu offices tend to be fastest, but don't let that discourage you if you're in other dzongkhags - the service is still good, just might take a bit longer.

My advice: always bring extra copies of documents, arrive early in the day, and be patient. The staff appreciate when people are respectful and prepared.

If you're not sure which office to go to, the citizen service centers can usually point you in the right direction.

What specific service are you trying to access?"""

        # Default conversational response
        else:
            return f"""I'd be happy to help you with that! 

From what you're asking about, it sounds like you might need information about government services here in Bhutan. I deal with these kinds of questions quite often.

Could you be a bit more specific about what you're trying to accomplish? Are you:
- Starting a business or looking into investment opportunities?
- Planning to visit or move to Bhutan?
- Dealing with documentation or legal requirements?
- Curious about our culture and way of life?

The more details you can give me, the better I can guide you to the right information and offices. We have quite a few different departments, and I want to make sure you don't waste time going to the wrong place!

What's your main goal here?"""
    
    async def summarize_documents(self, documents: List[Dict[str, Any]], query: str) -> str:
        """Summarize relevant documents for a query"""
        
        if not documents:
            return "I don't have specific documents about that right now, but let me share what I know from experience..."
        
        # Create a more natural summary prompt
        doc_contents = []
        for doc in documents[:3]:  # Limit to top 3 documents
            doc_contents.append(f"{doc.get('title', 'Government Document')}: {doc.get('content', '')[:400]}...")
        
        combined_content = "\n\n".join(doc_contents)
        
        prompt = f"""Based on these government documents and your knowledge of Bhutan, provide a helpful, conversational response to: "{query}"

Available information:
{combined_content}

Please respond as a knowledgeable civil servant who:
- Speaks naturally and conversationally
- Provides practical, actionable advice
- Mentions specific departments, timelines, and requirements when relevant
- Shows understanding of both local and foreign perspectives
- Includes helpful tips from experience
- Asks follow-up questions when appropriate
- Maintains respect for GNH principles without being preachy

Make it feel like a genuine conversation with someone who really knows the system."""

        system_message = """You are a helpful civil servant in Bhutan who genuinely cares about helping people navigate government services. You speak naturally, share practical insights, and make complex processes understandable. You're knowledgeable but not bureaucratic, friendly but professional."""

        return await self.generate_response(prompt, system_message, max_tokens=1500)
    
    async def health_check(self) -> bool:
        """Check if LLM services are available"""
        try:
            if self.openai_client:
                # Try a simple API call
                response = await self.generate_response("Hello", max_tokens=10)
                return len(response) > 0
            else:
                # Mock service is always available
                return True
        except Exception as e:
            logger.error(f"LLM health check failed: {e}")
            return False
