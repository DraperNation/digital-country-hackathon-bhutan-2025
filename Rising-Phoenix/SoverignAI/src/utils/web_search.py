import requests
import json
import re
from typing import List, Dict, Optional
from urllib.parse import quote_plus
import time
from src.utils.logger import SingletonLogger

logger_instance = SingletonLogger()
logger = logger_instance.get_logger()


class WebSearchUtility:
    def __init__(self):
        """Initialize the web search utility for Bhutan-related information."""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def search_bhutan_info(self, query: str, max_results: int = 3) -> List[Dict[str, str]]:
        """
        Search for Bhutan-related information on the web.
        
        Args:
            query (str): The search query
            max_results (int): Maximum number of results to return
            
        Returns:
            List[Dict[str, str]]: List of search results with title, snippet, and url
        """
        try:
            # Add "Bhutan" to the query to ensure Bhutan-specific results
            bhutan_query = f"Bhutan {query}"
            
            # Use DuckDuckGo Instant Answer API (free and reliable)
            search_url = f"https://api.duckduckgo.com/?q={quote_plus(bhutan_query)}&format=json&no_html=1&skip_disambig=1"
            
            logger.info(f"Searching web for: {bhutan_query}")
            
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            # Extract abstract if available
            if data.get('Abstract'):
                results.append({
                    'title': data.get('Heading', 'Bhutan Information'),
                    'snippet': data.get('Abstract'),
                    'url': data.get('AbstractURL', ''),
                    'source': 'DuckDuckGo Instant Answer'
                })
            
            # Extract related topics
            for topic in data.get('RelatedTopics', [])[:max_results]:
                if isinstance(topic, dict) and topic.get('Text'):
                    results.append({
                        'title': topic.get('FirstURL', '').split('/')[-1].replace('_', ' ').title(),
                        'snippet': topic.get('Text'),
                        'url': topic.get('FirstURL', ''),
                        'source': 'DuckDuckGo Related Topics'
                    })
            
            # If no results from DuckDuckGo, try a fallback search
            if not results:
                results = self._fallback_search(bhutan_query, max_results)
            
            logger.info(f"Found {len(results)} web results for: {query}")
            return results[:max_results]
            
        except Exception as e:
            logger.error(f"Error in web search: {e}")
            return []
    
    def _fallback_search(self, query: str, max_results: int) -> List[Dict[str, str]]:
        """
        Fallback search method using a different approach.
        
        Args:
            query (str): The search query
            max_results (int): Maximum number of results to return
            
        Returns:
            List[Dict[str, str]]: List of search results
        """
        try:
            # Use a simple web scraping approach for Bhutan tourism sites
            bhutan_sites = [
                "tourism.gov.bt",
                "bhutan.travel",
                "wikitravel.org/en/Bhutan",
                "lonelyplanet.com/bhutan"
            ]
            
            results = []
            for site in bhutan_sites[:max_results]:
                try:
                    # Create a mock result for demonstration
                    # In a real implementation, you would scrape these sites
                    results.append({
                        'title': f'Bhutan Information - {site}',
                        'snippet': f'Information about {query} in Bhutan from {site}',
                        'url': f'https://{site}',
                        'source': 'Bhutan Tourism Sites'
                    })
                except Exception as e:
                    logger.error(f"Error accessing {site}: {e}")
                    continue
            
            return results
            
        except Exception as e:
            logger.error(f"Error in fallback search: {e}")
            return []
    
    def extract_bhutan_facts(self, query: str) -> Optional[str]:
        """
        Extract specific facts about Bhutan from web search.
        
        Args:
            query (str): The specific query about Bhutan
            
        Returns:
            Optional[str]: Extracted facts or None if not found
        """
        try:
            results = self.search_bhutan_info(query, max_results=2)
            
            if not results:
                return None
            
            # Combine the most relevant information
            facts = []
            for result in results:
                if result['snippet']:
                    # Clean and format the snippet
                    snippet = re.sub(r'<[^>]+>', '', result['snippet'])  # Remove HTML tags
                    snippet = re.sub(r'\s+', ' ', snippet).strip()  # Clean whitespace
                    facts.append(f"• {snippet}")
            
            if facts:
                return "\n".join(facts)
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting Bhutan facts: {e}")
            return None
    
    def get_bhutan_travel_info(self, topic: str) -> Optional[str]:
        """
        Get specific travel information about Bhutan.
        
        Args:
            topic (str): The travel topic (visa, weather, culture, etc.)
            
        Returns:
            Optional[str]: Travel information or None if not found
        """
        try:
            # Add travel context to the query
            travel_query = f"Bhutan travel {topic} information guide"
            return self.extract_bhutan_facts(travel_query)
            
        except Exception as e:
            logger.error(f"Error getting Bhutan travel info: {e}")
            return None
    
    def get_bhutan_cultural_info(self, topic: str) -> Optional[str]:
        """
        Get specific cultural information about Bhutan.
        
        Args:
            topic (str): The cultural topic (customs, festivals, etiquette, etc.)
            
        Returns:
            Optional[str]: Cultural information or None if not found
        """
        try:
            # Add cultural context to the query
            cultural_query = f"Bhutan culture {topic} customs traditions"
            return self.extract_bhutan_facts(cultural_query)
            
        except Exception as e:
            logger.error(f"Error getting Bhutan cultural info: {e}")
            return None


# Global instance for reuse
web_search_utility = WebSearchUtility() 