import sys
import logging
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
import asyncio
import os
import shutil
import hashlib
import httpx
from urllib.parse import urlparse, urljoin, unquote
import re
import openai
import json
import time
import tiktoken
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from playwright.async_api import async_playwright
from concurrent.futures import ThreadPoolExecutor

from google.genai import types
import google.adk
from google.adk.agents.llm_agent import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.function_tool import FunctionTool

load_dotenv()

# --- Logging Configuration ---
logging.basicConfig(
    force=True,
    stream=sys.stderr,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)
logger = logging.getLogger(__name__)

print(f"DEBUG: google.adk version: {getattr(google.adk, '__version__', 'N/A')}", file=sys.stderr)
print(f"DEBUG: google.adk path: {getattr(google.adk, '__path__', 'N/A')}", file=sys.stderr)

mcp_server = FastMCP("BhutanEResidencyAgent")

# --- Global Configuration ---
BASE_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".bhutan_eresidency_cache")
ERESIDENCY_STATE_FILE = os.path.join(BASE_CACHE_DIR, ".eresidency_services_state.json")

# Global state for Bhutan e-residency services
ERESIDENCY_SERVICES = {}  # {service_id: BhutanGovernmentService}
CURRENT_ACTIVE_SERVICE = None

# --- Data Classes for Bhutan E-Residency System ---

@dataclass
class BhutanGovernmentService:
    """Represents a single Bhutan government service documentation source."""
    url: str
    service_name: str
    cache_dir: str
    file_count: int
    detailed_index_content: str
    summary: str = ""  # AI-generated summary of service capabilities
    service_type: str = "government"  # government, immigration, business, regulatory
    status: str = "active"
    
@dataclass
class EResidencyServiceCollection:
    """Represents a collection of Bhutan government services for e-residency."""
    collection_id: str
    name: str
    description: str
    services: Dict[str, BhutanGovernmentService] = field(default_factory=dict)
    cache_dir: str = ""
    combined_index: str = ""  # Combined index for comprehensive e-residency guidance
    collection_summary: str = ""  # Overall summary of e-residency capabilities
    total_pages: int = 0
    is_combined: bool = False  # True if services are combined for comprehensive guidance
    created_at: float = field(default_factory=time.time)
    
    def add_service(self, service: BhutanGovernmentService):
        """Add a government service to this e-residency collection."""
        self.services[service.url] = service
        self.total_pages += service.file_count
        self.is_combined = self.total_pages < 100

@dataclass 
class GovernmentServiceItem:
    """Represents a single government service URL for batch processing."""
    url: str
    service_name: str = ""
    description: str = ""
    service_type: str = "government"

# --- State Management Functions ---

def save_eresidency_state():
    """Save the e-residency services state to JSON file."""
    global ERESIDENCY_SERVICES, CURRENT_ACTIVE_SERVICE
    
    try:
        os.makedirs(BASE_CACHE_DIR, exist_ok=True)
        
        # Convert dataclasses to dict for JSON serialization
        serializable_collections = {}
        for collection_id, collection in ERESIDENCY_SERVICES.items():
            serializable_services = {}
            for url, service in collection.services.items():
                serializable_services[url] = {
                    'url': service.url,
                    'service_name': service.service_name,
                    'cache_dir': service.cache_dir,
                    'file_count': service.file_count,
                    'detailed_index_content': service.detailed_index_content,
                    'summary': service.summary,
                    'service_type': service.service_type,
                    'status': service.status
                }
            
            serializable_collections[collection_id] = {
                'collection_id': collection.collection_id,
                'name': collection.name,
                'description': collection.description,
                'services': serializable_services,
                'cache_dir': collection.cache_dir,
                'combined_index': collection.combined_index,
                'collection_summary': collection.collection_summary,
                'total_pages': collection.total_pages,
                'is_combined': collection.is_combined,
                'created_at': collection.created_at
            }
        
        state_data = {
            'eresidency_services': serializable_collections,
            'current_active_service': CURRENT_ACTIVE_SERVICE
        }
        
        with open(ERESIDENCY_STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved Bhutan e-residency state to: {ERESIDENCY_STATE_FILE}")
        
    except Exception as e:
        logger.error(f"Failed to save e-residency state: {e}", exc_info=True)

def load_eresidency_state():
    """Load the e-residency services state from JSON file."""
    global ERESIDENCY_SERVICES, CURRENT_ACTIVE_SERVICE
    
    try:
        if os.path.exists(ERESIDENCY_STATE_FILE):
            with open(ERESIDENCY_STATE_FILE, 'r', encoding='utf-8') as f:
                state_data = json.load(f)
            
            # Validate and restore service collections
            loaded_collections = {}
            for collection_id, collection_data in state_data.get('eresidency_services', {}).items():
                cache_dir = collection_data.get('cache_dir')
                if cache_dir and os.path.exists(cache_dir):
                    # Restore services
                    services = {}
                    for url, service_data in collection_data.get('services', {}).items():
                        service_cache_dir = service_data.get('cache_dir')
                        if service_cache_dir and os.path.exists(service_cache_dir):
                            services[url] = BhutanGovernmentService(**service_data)
                            logger.info(f"Restored Bhutan government service: {url}")
                        else:
                            logger.warning(f"Skipping service {url} - cache directory not found: {service_cache_dir}")
                    
                    if services:  # Only restore collection if it has valid services
                        collection = EResidencyServiceCollection(
                            collection_id=collection_data['collection_id'],
                            name=collection_data['name'],
                            description=collection_data['description'],
                            cache_dir=collection_data['cache_dir'],
                            combined_index=collection_data.get('combined_index', ''),
                            collection_summary=collection_data.get('collection_summary', ''),
                            total_pages=collection_data.get('total_pages', 0),
                            is_combined=collection_data.get('is_combined', False),
                            created_at=collection_data.get('created_at', time.time())
                        )
                        collection.services = services
                        loaded_collections[collection_id] = collection
                        logger.info(f"Restored e-residency collection: {collection_id} with {len(services)} services")
                    else:
                        logger.warning(f"Skipping collection {collection_id} - no valid services")
                else:
                    logger.warning(f"Skipping collection {collection_id} - cache directory not found: {cache_dir}")
            
            ERESIDENCY_SERVICES = loaded_collections
            
            # Restore active service collection
            current_active = state_data.get('current_active_service')
            if current_active and current_active in ERESIDENCY_SERVICES:
                CURRENT_ACTIVE_SERVICE = current_active
                logger.info(f"Restored active e-residency service collection: {current_active}")
            else:
                CURRENT_ACTIVE_SERVICE = None
                logger.info("No valid active e-residency service collection found")
            
            logger.info(f"Loaded {len(ERESIDENCY_SERVICES)} Bhutan e-residency service collections from state file")
            
        else:
            logger.info("No existing e-residency state file found")
            
    except Exception as e:
        logger.error(f"Failed to load e-residency state: {e}", exc_info=True)

def create_service_collection_id(name: str) -> str:
    """Create a unique service collection ID from name."""
    safe_name = re.sub(r'[^\w\s-]', '', name)
    safe_name = re.sub(r'\s+', '_', safe_name).strip('_-').lower()
    timestamp = int(time.time())
    return f"bhutan_{safe_name}_{timestamp}"

# --- Core Utility Functions ---

def extract_service_name_from_url(url: str) -> str:
    """Extract service name from Bhutan government URL."""
    try:
        parsed_url = urlparse(url)
        domain_parts = parsed_url.netloc.lower().split('.')
        
        # Special handling for Bhutan government domains
        bhutan_service_mapping = {
            'citizenservices.gov.bt': 'Citizen_Services',
            'g2b.gov.bt': 'Business_Registration',
            'immi.gov.bt': 'Immigration_Services', 
            'bhutan.eregulations.org': 'Regulatory_Procedures',
            'bbs.bt': 'Government_News',
            'moic.gov.bt': 'Digital_Infrastructure',
            'bhutan.gov.bt': 'Central_Government_Portal',
            'doi.gov.bt': 'Immigration_Department',
            'permit.doi.gov.bt': 'Permit_Services',
            'tech.gov.bt': 'Technology_Services'
        }
        
        # Check for exact domain match first
        domain = parsed_url.netloc.lower()
        if domain in bhutan_service_mapping:
            return bhutan_service_mapping[domain]
        
        # Fallback to generic extraction
        meaningful_parts = [p for p in domain_parts if p not in ['www', 'com', 'org', 'net', 'bt', 'gov']]
        if meaningful_parts:
            service_name = '_'.join(meaningful_parts)
        else:
            service_name = 'bhutan_government_service'
        
        # Make it filesystem-safe
        safe_name = re.sub(r'[^\w-]', '_', service_name)
        safe_name = re.sub(r'_+', '_', safe_name).strip('_')
        
        if not safe_name:
            safe_name = 'bhutan_service'
        
        logger.info(f"Extracted service name from URL '{url}' -> '{safe_name}'")
        return safe_name
        
    except Exception as e:
        logger.error(f"Error extracting service name from URL {url}: {e}")
        return "bhutan_service"

def get_unique_cache_dir_name(service_name: str, url: str, collection_id: str) -> str:
    """Create unique cache directory name for a service within a collection."""
    base_name = f"{collection_id}_{service_name}"
    full_path = os.path.join(BASE_CACHE_DIR, base_name)
    
    if not os.path.exists(full_path):
        return base_name
    
    # Add hash suffix if directory exists
    url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()[:8]
    unique_name = f"{base_name}_{url_hash}"
    logger.info(f"Cache directory exists. Using unique name: {unique_name}")
    return unique_name

async def download_file(url: str, session: httpx.AsyncClient, timeout_seconds: int = 30) -> str | None:
    """Downloads content from Bhutan government websites."""
    try:
        logger.info(f"Downloading Bhutan government content: {url}")
        response = await session.get(url, follow_redirects=True, timeout=timeout_seconds)
        response.raise_for_status() 
        logger.info(f"Successfully downloaded: {url} (status: {response.status_code})")
        return response.text
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error {e.response.status_code} while downloading {url}: {e.response.text[:200]}...")
    except httpx.RequestError as e:
        logger.error(f"Request error while downloading {url}: {e}")
    except Exception as e:
        logger.error(f"Unexpected error downloading {url}: {e}", exc_info=True)
    return None

# --- AI Summarization for Bhutan Government Services ---

async def generate_service_summary_async(service: BhutanGovernmentService) -> str:
    """Generate AI summary of Bhutan government service capabilities."""
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY not found. Cannot generate service summary.")
        return "Error: OPENAI_API_KEY not configured. Summary generation skipped."

    client = openai.AsyncOpenAI(api_key=openai_api_key)
    
    content_for_summary = service.detailed_index_content[:20000]  # Limit content size
    
    system_prompt = """You are an expert analyst of Bhutan government services and e-residency procedures. Your task is to analyze government service documentation and provide comprehensive summaries for e-residents."""
    
    user_prompt = f"""Please analyze the Bhutan government service documentation for '{service.service_name}' from {service.url}.

This is for Bhutan's e-residency program. Provide a comprehensive summary in the following format:

**Service Purpose & Scope:**
- What government services does this provide for e-residents? (2-3 sentences)

**Key Services for E-Residents:**
- List the 5-8 most important services/procedures relevant to e-residents

**Service Type:**
- What type of government service is this? (Immigration, Business Registration, Regulatory, Citizen Services, etc.)

**Target Users:**
- Who can use these services? (Citizens, residents, foreigners, businesses)

**Digital Capabilities:**
- What online/digital services are available? Any e-services or digital processes?

**E-Residency Relevance:**
- How does this service support Bhutan's e-residency and digital transformation goals?

Government Service Documentation:
---
{content_for_summary}
---
"""

    try:
        logger.info(f"Requesting service summary from OpenAI for Bhutan service: {service.url}")
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
        )
        summary = completion.choices[0].message.content
        logger.info(f"Successfully generated service summary for: {service.url}")
        return summary.strip() if summary else "No summary could be generated."
    except Exception as e:
        logger.error(f"Error calling OpenAI for service summary of {service.url}: {e}", exc_info=True)
        return f"Error during summary generation for {service.url}: {str(e)}"

async def generate_eresidency_collection_summary_async(collection: EResidencyServiceCollection) -> str:
    """Generate comprehensive summary for Bhutan e-residency service collection."""
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY not found. Cannot generate collection summary.")
        return "Error: OPENAI_API_KEY not configured. Summary generation skipped."

    client = openai.AsyncOpenAI(api_key=openai_api_key)
    
    # Prepare input content from all service summaries
    service_summaries = []
    for url, service in collection.services.items():
        if service.summary:
            service_summaries.append(f"**{service.service_name}** ({url}):\n{service.summary}")
    
    content_for_summary = "\n\n---\n\n".join(service_summaries)[:25000]
    
    system_prompt = """You are an expert analyst of Bhutan's digital government transformation and e-residency program. Your task is to analyze multiple government services and provide comprehensive guidance for e-residents."""
    
    user_prompt = f"""Please analyze this collection of {len(collection.services)} Bhutan government services for e-residency and provide a comprehensive summary.

Collection Name: {collection.name}
Description: {collection.description}
Total Services: {len(collection.services)}
Total Pages: {collection.total_pages}

This is for Bhutan's e-residency program under Digital Drukyul. Provide a comprehensive summary:

**E-Residency Service Overview:**
- What does this collection of government services enable for e-residents? (2-3 sentences)

**Key E-Residency Capabilities:**
- List the main services/processes e-residents can complete through these systems

**Service Categories:**
- What types of government services are included? (Immigration, Business, Regulatory, etc.)

**Digital Transformation Alignment:**
- How do these services support Bhutan's Digital Drukyul initiative?

**E-Resident Journey Support:**
- What stages of the e-residency journey do these services support? (Application, Onboarding, Business Setup, Ongoing Compliance)

**Service Integration:**
- How do the different government services work together for e-residents?

**Unique Value Proposition:**
- What makes Bhutan's e-residency services unique compared to other countries?

Individual Service Summaries:
---
{content_for_summary}
---
"""

    try:
        logger.info(f"Requesting e-residency collection summary from OpenAI for: {collection.name}")
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
        )
        summary = completion.choices[0].message.content
        logger.info(f"Successfully generated e-residency collection summary for: {collection.name}")
        return summary.strip() if summary else "No collection summary could be generated."
    except Exception as e:
        logger.error(f"Error calling OpenAI for e-residency collection summary of {collection.name}: {e}", exc_info=True)
        return f"Error during collection summary generation for {collection.name}: {str(e)}"

# --- Simplified Scraping Functions for Bhutan Government Sites ---

async def scrape_government_site_async(url: str, output_folder: str) -> Dict[str, Any]:
    """Scrape a Bhutan government website and return metadata."""
    logger.info(f"Scraping Bhutan government site: {url}")
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (compatible; BhutanEResidencyBot/1.0)"
            )
            page = await context.new_page()
            
            try:
                response = await page.goto(url, timeout=30000, wait_until='domcontentloaded')
                actual_url = response.url if response else url
                
                await page.wait_for_timeout(3000)  # Wait for dynamic content
                html_content = await page.content()
                
            except Exception as e:
                logger.warning(f"Error loading Bhutan government site {url}: {e}")
                await browser.close()
                return {}
            
            await browser.close()

        # Process government content
        soup = BeautifulSoup(html_content, 'html.parser')
        title_tag = soup.find('title')
        page_title = title_tag.string.strip() if title_tag else f"Bhutan Government - {urlparse(actual_url).netloc}"
        
        # Extract main content from government site
        content_selectors = [
            'main', 'article', '.main-content', '.content', 
            '.page-content', '#content', '.gov-content', 'body'
        ]
        
        content_element = None
        for selector in content_selectors:
            if selector.startswith('.') or selector.startswith('#'):
                content_element = soup.select_one(selector)
            else:
                content_element = soup.find(selector)
            if content_element:
                break
        
        if not content_element:
            logger.warning(f"No suitable content found for {actual_url}")
            return {}

        # Clean up content
        for unwanted in content_element.find_all(['script', 'style', 'nav', 'header', 'footer']):
            unwanted.decompose()

        markdown_content = md(str(content_element), heading_style="atx", bullets="-")
        markdown_content = '\n'.join([line for line in markdown_content.split('\n') if line.strip()]).strip()
        
        if len(markdown_content) < 100:
            logger.info(f"Skipping page with minimal content: {actual_url}")
            return {}
        
        # Save content
        parsed_url = urlparse(actual_url)
        safe_filename = re.sub(r'[^\w\s-]', '_', page_title)
        safe_filename = re.sub(r'\s+', '_', safe_filename) + ".md"
        
        os.makedirs(output_folder, exist_ok=True)
        file_path = os.path.join(output_folder, safe_filename)
        
        final_markdown = f"# {page_title}\n\nSource: {actual_url}\nGovernment Service: Bhutan Digital Government\n\n{markdown_content}"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_markdown)
        
        return {
            'url': url,
            'actual_url': actual_url,
            'title': page_title,
            'content': final_markdown,
            'file_path': file_path,
            'processing_time': 1.0
        }

    except Exception as e:
        logger.error(f"Error processing Bhutan government site {url}: {e}")
        return {}

# --- MCP Tools for Bhutan E-Residency System ---

@mcp_server.tool()
async def create_eresidency_service_collection(name: str, description: str, service_urls: List[str], max_workers: int = 5) -> str:
    """Create a new Bhutan e-residency service collection by indexing multiple government websites."""
    global ERESIDENCY_SERVICES, CURRENT_ACTIVE_SERVICE
    
    logger.info(f"Creating Bhutan e-residency service collection '{name}' with {len(service_urls)} government services")
    
    try:
        # Validate inputs
        if not name or not service_urls:
            return "ERROR: Collection name and service URLs list are required."
        
        if len(service_urls) > 15:
            return "ERROR: Maximum 15 government service URLs allowed per collection."
        
        # Create collection
        collection_id = create_service_collection_id(name)
        collection_cache_dir = os.path.join(BASE_CACHE_DIR, collection_id)
        os.makedirs(collection_cache_dir, exist_ok=True)
        
        collection = EResidencyServiceCollection(
            collection_id=collection_id,
            name=name,
            description=description,
            cache_dir=collection_cache_dir
        )
        
        # Process each government service URL
        successful_services = 0
        failed_services = 0
        
        for url in service_urls:
            try:
                logger.info(f"Processing Bhutan government service: {url}")
                
                # Extract service name and create cache directory
                service_name = extract_service_name_from_url(url)
                service_cache_dir_name = get_unique_cache_dir_name(service_name, url, collection_id)
                service_cache_dir = os.path.join(BASE_CACHE_DIR, service_cache_dir_name)
                os.makedirs(service_cache_dir, exist_ok=True)
                
                # Scrape the government website
                scraped_result = await scrape_government_site_async(url, service_cache_dir)
                
                if not scraped_result:
                    logger.warning(f"No content scraped from Bhutan government service {url}")
                    failed_services += 1
                    continue
                
                # Generate detailed index
                downloaded_files_map = {scraped_result['file_path']: scraped_result['actual_url']}
                
                # Simple detailed index for single page
                detailed_index_content = f"# Bhutan Government Service: {service_name}\n\n"
                detailed_index_content += f"**Service URL:** {url}\n\n"
                detailed_index_content += f"**Page Title:** {scraped_result['title']}\n\n"
                detailed_index_content += f"**Content Summary:** Government service documentation for Bhutan e-residency program.\n\n"
                
                # Determine service type
                service_type = "government"
                if "immigration" in service_name.lower() or "visa" in service_name.lower():
                    service_type = "immigration"
                elif "business" in service_name.lower() or "g2b" in url.lower():
                    service_type = "business"
                elif "regulation" in service_name.lower():
                    service_type = "regulatory"
                
                # Create government service
                service = BhutanGovernmentService(
                    url=url,
                    service_name=service_name,
                    cache_dir=service_cache_dir,
                    file_count=1,
                    detailed_index_content=detailed_index_content,
                    service_type=service_type,
                    status="active"
                )
                
                # Generate service summary
                service.summary = await generate_service_summary_async(service)
                
                # Add to collection
                collection.add_service(service)
                successful_services += 1
                logger.info(f"Successfully processed Bhutan service {url}")
                
            except Exception as e:
                logger.error(f"Failed to process Bhutan government service {url}: {e}", exc_info=True)
                failed_services += 1
        
        if successful_services == 0:
            return f"ERROR: Failed to process any Bhutan government services for collection '{name}'."
        
        # Generate collection summary
        collection.collection_summary = await generate_eresidency_collection_summary_async(collection)
        
        # Store collection
        ERESIDENCY_SERVICES[collection_id] = collection
        CURRENT_ACTIVE_SERVICE = collection_id
        save_eresidency_state()
        
        success_msg = f"""Successfully created Bhutan e-residency service collection '{name}' (ID: {collection_id}).

🏛️ BHUTAN E-RESIDENCY SERVICES:
• Government services processed: {successful_services} out of {len(service_urls)} URLs
• Failed services: {failed_services}
• Total documentation pages: {collection.total_pages}
• Combined guidance mode: {'Yes' if collection.is_combined else 'No'} (< 100 pages)
• Collection set as active for e-residency queries

Ready to assist with Bhutan e-residency procedures via ask_eresidency_agent."""
        
        return success_msg
        
    except Exception as e:
        error_msg = f"Error creating Bhutan e-residency collection '{name}': {e}"
        logger.error(error_msg, exc_info=True)
        return f"ERROR: {error_msg}"

@mcp_server.tool()
async def ask_eresidency_agent(query: str, collection_id: str = None) -> str:
    """Ask the Bhutan e-residency agent a question with intelligent routing to relevant government services."""
    global CURRENT_ACTIVE_SERVICE
    
    logging.info(f"Bhutan e-residency agent query: {query[:100]}...")
    
    try:
        # Determine which service collection to use
        if collection_id:
            if collection_id not in ERESIDENCY_SERVICES:
                available = ", ".join(ERESIDENCY_SERVICES.keys()) if ERESIDENCY_SERVICES else "None"
                return f"ERROR: Bhutan e-residency collection '{collection_id}' not found. Available: {available}"
            target_collection = ERESIDENCY_SERVICES[collection_id]
        elif CURRENT_ACTIVE_SERVICE and CURRENT_ACTIVE_SERVICE in ERESIDENCY_SERVICES:
            target_collection = ERESIDENCY_SERVICES[CURRENT_ACTIVE_SERVICE]
            collection_id = CURRENT_ACTIVE_SERVICE
        else:
            return "ERROR: No active Bhutan e-residency services configured. Use 'create_eresidency_service_collection' first."
        
        if not target_collection.services:
            return f"ERROR: Bhutan e-residency collection '{target_collection.name}' has no government services."
        
        # Create the Bhutan e-residency agent
        agent = await get_bhutan_eresidency_agent_async(target_collection, query)
        
        # Run the agent
        session_service = InMemorySessionService()
        runner = Runner(
            app_name="bhutan_eresidency_app",
            agent=agent,
            session_service=session_service,
        )
        
        session = await session_service.create_session(
            state={}, app_name="bhutan_eresidency_app", user_id="eresidency_user"
        )
        
        result_parts = []
        async for event in runner.run_async(
            session_id=session.id,
            user_id="eresidency_user",
            new_message=types.Content(role="user", parts=[types.Part(text=query)])
        ):
            if hasattr(event, 'content') and event.content and hasattr(event.content, 'parts'):
                for part in event.content.parts:
                    if hasattr(part, 'text') and part.text:
                        result_parts.append(part.text)
        
        final_response = "".join(result_parts)
        
        if final_response:
            # Add Bhutan e-residency context
            service_info = f"\n\n---\n🇧🇹 **Bhutan E-Residency Services:** Guidance provided using {len(target_collection.services)} government services from '{target_collection.name}' collection."
            return final_response + service_info
        else:
            return "The Bhutan e-residency agent did not produce a response."
        
    except Exception as e:
        logging.error(f"Error in Bhutan e-residency agent: {e}", exc_info=True)
        return f"ERROR: {str(e)}"

@mcp_server.tool()
async def list_eresidency_services() -> str:
    """List all Bhutan e-residency service collections and their government services."""
    global ERESIDENCY_SERVICES, CURRENT_ACTIVE_SERVICE
    
    if not ERESIDENCY_SERVICES:
        return "No Bhutan e-residency service collections found. Use 'create_eresidency_service_collection' to set up government services."
    
    result_lines = ["🏛️ Bhutan E-Residency Government Services:"]
    result_lines.append("=" * 60)
    
    for collection_id, collection in ERESIDENCY_SERVICES.items():
        active_marker = " 🎯 (ACTIVE)" if collection_id == CURRENT_ACTIVE_SERVICE else ""
        result_lines.append(f"\n🇧🇹 **{collection.name}**{active_marker}")
        result_lines.append(f"   ID: {collection_id}")
        result_lines.append(f"   Description: {collection.description}")
        result_lines.append(f"   Government Services: {len(collection.services)}")
        result_lines.append(f"   Total Pages: {collection.total_pages}")
        result_lines.append(f"   Combined Guidance: {'Yes' if collection.is_combined else 'No'}")
        result_lines.append(f"   Created: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(collection.created_at))}")
        
        # List government services
        result_lines.append("   🏛️ Government Services:")
        for url, service in collection.services.items():
            status_emoji = "✅" if service.status == "active" else "❌"
            service_type_emoji = {"immigration": "🛂", "business": "🏢", "regulatory": "📋", "government": "🏛️"}.get(service.service_type, "🏛️")
            result_lines.append(f"      {status_emoji} {service_type_emoji} {service.service_name}: {url}")
        
    return "\n".join(result_lines)

# --- Agent Creation and File Reading Tools ---

def read_eresidency_files(collection_id: str, file_paths: List[str]) -> str:
    """Read and concatenate files from Bhutan e-residency service collection."""
    if collection_id not in ERESIDENCY_SERVICES:
        return f"ERROR: Bhutan e-residency collection '{collection_id}' not found."
    
    collection = ERESIDENCY_SERVICES[collection_id]
    all_content = []
    
    for file_path in file_paths:
        if not file_path:
            continue
        
        # Search for file in any of the collection's services
        file_found = False
        for service in collection.services.values():
            full_path = os.path.join(service.cache_dir, file_path)
            full_path = os.path.normpath(full_path)
            
            # Security check
            if not full_path.startswith(service.cache_dir):
                continue
            
            if os.path.exists(full_path) and os.path.isfile(full_path):
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    all_content.append(f"=== Bhutan Government Service: {file_path} (from {service.service_name}) ===\n{content}")
                    file_found = True
                    break
                except Exception as e:
                    logger.error(f"Failed to read Bhutan government file {file_path} from {service.service_name}: {e}")
        
        if not file_found:
            all_content.append(f"Bhutan government file not found: {file_path}")
    
    return "\n\n".join(all_content)

async def get_bhutan_eresidency_agent_async(collection: EResidencyServiceCollection, query: str) -> LlmAgent:
    """Create Bhutan e-residency agent with access to government services."""
    read_files_tool = FunctionTool(lambda file_paths: read_eresidency_files(collection.collection_id, file_paths))
    
    # Build comprehensive instruction for Bhutan e-residency
    service_summaries = []
    for url, service in collection.services.items():
        service_summaries.append(f"**{service.service_name}** ({service.service_type}):\n{service.summary[:1000] if service.summary else 'Government service documentation available.'}")
    
    instruction = f"""You are the official Bhutan E-Residency Assistant, part of Bhutan's Digital Drukyul initiative. You provide authoritative guidance on e-residency procedures, government services, and digital transformation in Bhutan.

🇧🇹 **Bhutan E-Residency Program Overview:**
{collection.collection_summary[:2000] if collection.collection_summary else 'Supporting Bhutan Digital Government transformation and e-residency services.'}

**Available Government Services:** {', '.join([service.service_name for service in collection.services.values()])}

**Your Expertise Areas:**
- Immigration and visa procedures for e-residents
- Business registration and licensing through G2B portal
- Regulatory compliance and procedures
- Digital government services and citizen services
- Bhutan's Digital Drukyul initiative
- Cross-border digital residency benefits

**Your Workflow:**
1. **Understand E-Residency Context**: Analyze queries in the context of Bhutan's e-residency program
2. **Access Government Services**: Use the government service documentation to provide accurate, official information
3. **Read Official Documentation**: Use `read_eresidency_files` to access specific government documents and procedures
4. **Provide Comprehensive Guidance**: Offer step-by-step guidance for e-residency procedures
5. **Cite Official Sources**: Always reference which government service and documentation you used
6. **Support Digital Transformation**: Emphasize Bhutan's unique approach to digital sovereignty and Gross National Happiness

**Government Service Documentation:**
{chr(10).join(service_summaries)}

Remember: You represent Bhutan's commitment to digital innovation while preserving cultural values and sovereignty. Provide accurate, helpful guidance for e-residents navigating Bhutan's digital government services.
"""
    
    return LlmAgent(
        name="bhutan_eresidency_agent",
        instruction=instruction,
        tools=[read_files_tool],
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-pro-preview-03-25")
    )

# --- Additional Tools ---

@mcp_server.tool()
async def initialize_bhutan_eresidency_demo() -> str:
    """Initialize a demo Bhutan e-residency collection with key government services."""
    demo_services = [
        "https://citizenservices.gov.bt",
        "https://g2b.gov.bt", 
        "https://immi.gov.bt",
        "https://bhutan.eregulations.org",
        "https://moic.gov.bt",
        "https://bhutan.gov.bt"
    ]
    
    return await create_eresidency_service_collection(
        name="Bhutan E-Residency Core Services",
        description="Core Bhutan government services for e-residency program including immigration, business registration, regulatory procedures, and digital infrastructure under Digital Drukyul initiative.",
        service_urls=demo_services,
        max_workers=3
    )

@mcp_server.tool() 
async def test_bhutan_eresidency_system() -> str:
    """Test the Bhutan e-residency system functionality."""
    try:
        result = ["=== Bhutan E-Residency System Test ==="]
        
        # Test 1: System configuration
        result.append(f"✅ Bhutan e-residency cache: {BASE_CACHE_DIR}")
        result.append(f"✅ Cache directory exists: {os.path.exists(BASE_CACHE_DIR)}")
        
        # Test 2: Service collections
        result.append(f"✅ E-residency service collections: {len(ERESIDENCY_SERVICES)}")
        result.append(f"✅ Active service collection: {CURRENT_ACTIVE_SERVICE or 'None'}")
        
        # Test 3: API keys for Bhutan government analysis
        openai_key = os.getenv("OPENAI_API_KEY")
        result.append(f"✅ OpenAI API key (for government analysis): {bool(openai_key)}")
        
        gemini_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        result.append(f"✅ Gemini API key (for e-residency agent): {bool(gemini_key)}")
        
        # Test 4: HTTP client for government sites
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("https://httpbin.org/get", timeout=5)
                result.append(f"✅ HTTP client (for government sites): SUCCESS (status {response.status_code})")
        except Exception as e:
            result.append(f"❌ HTTP client test: FAILED - {e}")
        
        result.append(f"\n🇧🇹 Bhutan E-Residency System Ready for Digital Drukyul!")
        
        return "\n".join(result)
        
    except Exception as e:
        return f"ERROR in Bhutan e-residency system test: {e}"

# --- Main Initialization ---

async def main_async():
    """Initialize the Bhutan e-residency system."""
    global ERESIDENCY_SERVICES, CURRENT_ACTIVE_SERVICE
    
    logger.info("🇧🇹 Starting Bhutan E-Residency Agent MCP Server...")
    
    # Check for required API keys
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.warning("OPENAI_API_KEY not set. Government service analysis will be limited.")
    else:
        logger.info("OPENAI_API_KEY found. Government service analysis enabled.")
    
    gemini_api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        logger.warning("GOOGLE_API_KEY/GEMINI_API_KEY not set. E-residency agents will not work.")
    else:
        logger.info("Gemini API key found. Bhutan e-residency agents enabled.")
    
    # Create Bhutan e-residency cache directory
    os.makedirs(BASE_CACHE_DIR, exist_ok=True)
    logger.info(f"Bhutan e-residency cache directory: {BASE_CACHE_DIR}")
    
    # Load existing e-residency state
    load_eresidency_state()
    
    if ERESIDENCY_SERVICES:
        logger.info(f"🏛️ Loaded {len(ERESIDENCY_SERVICES)} existing Bhutan e-residency service collections:")
        for collection_id, collection in ERESIDENCY_SERVICES.items():
            active_marker = " (ACTIVE)" if collection_id == CURRENT_ACTIVE_SERVICE else ""
            logger.info(f"  - {collection.name}: {len(collection.services)} government services{active_marker}")
    else:
        logger.info("No existing Bhutan e-residency service collections found.")
        logger.info("Use 'initialize_bhutan_eresidency_demo' to set up core government services.")
    
    logger.info("🇧🇹 Bhutan E-Residency Agent MCP Server initialization complete.")
    logger.info("Ready to support Digital Drukyul and e-residency services!")

if __name__ == "__main__":
    import asyncio
    
    # Run initialization
    asyncio.run(main_async())
    
    # Start MCP server
    try:
        logger.info("🇧🇹 Starting Bhutan E-Residency MCP server...")
        mcp_server.run()
        logger.info("Bhutan E-Residency MCP server completed execution.")
    except KeyboardInterrupt:
        logger.info("🇧🇹 Bhutan E-Residency MCP Server shutting down.")
    except Exception as e:
        logger.error(f"Bhutan E-Residency MCP server crashed: {e}", exc_info=True)
    finally:
        logger.info("🇧🇹 Bhutan E-Residency Agent MCP Server has shut down.") 