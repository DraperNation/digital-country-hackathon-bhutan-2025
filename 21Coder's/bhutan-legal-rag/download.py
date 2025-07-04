#!/usr/bin/env python3
"""
Enhanced Bhutan Legal Document Downloader
This script has better retry logic and alternative sources
"""

import requests
import time
import os
from pathlib import Path
from tqdm import tqdm
import random

class EnhancedBhutanDownloader:
    def __init__(self, data_dir="bhutan_legal_data"):
        self.data_dir = Path(data_dir)
        self.docs_dir = self.data_dir / "documents"
        self.docs_dir.mkdir(parents=True, exist_ok=True)
        
        # Enhanced URL list with alternatives
        self.legal_urls = {
            "Constitution_2008": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Constitution_of_Bhutan.pdf",
                "https://www.constituteproject.org/constitution/Bhutan_2008.pdf",
                "https://www.nationalcouncil.bt/assets/uploads/docs/acts/2017/Constitution_of_Bhutan_2008.pdf"
            ],
            "Penal_Code_2004": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Penal-Code-of-Bhutan-2004_English-version_.pdf"
            ],
            "Civil_Criminal_Procedure_2001": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Civil-and-Criminal-Procedure-Code-of-Bhutan-2001English-version0.pdf"
            ],
            "Anti_Corruption_Act_2011": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Anti Corruption Act 2011.pdf"
            ],
            "Land_Act_2007": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Land-Act-of-Bhutan-2007_English.pdf"
            ],
            "Labour_Employment_Act_2007": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Labour-and-Employment-Act-of-Bhutan-2007Both-Dzongkha-English.pdf"
            ],
            "Civil_Service_Act_2010": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Civil-Service-Act-of-Bhutan-2010-English-and-Dzongkha.pdf"
            ],
            "Tax_Act_2022": [
                "https://oag.gov.bt/wp-content/uploads/2023/01/Tax-Act-of-Bhutan-2022.pdf"
            ],
            "Environment_Protection_Act_2007": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/National-Environment-Protection-Act-of-Bhutan-2007English-version.pdf"
            ],
            "Election_Act_2008": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Election-Act-of-Bhutan-2008both-Dzongkha-English.pdf"
            ],
            "Judicial_Service_Act_2007": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Judicial-Service-Act-of-Bhutan-2007English-version.pdf"
            ],
            "Immigration_Act_2007": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Immigration-Act-of-the-Kingdom-of-Bhutan2007-English.pdf"
            ],
            "Tobacco_Control_Act_2010": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Tobacco-Control-Act-of-Bhutan-2010-both-Dzongkha-English.pdf"
            ],
            "Prison_Act_2009": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Prison-Act-of-Bhutan-2009both-Dzongkha-English.pdf"
            ],
            "Forest_Conservation_Act_1995": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Forest-and-Nature-Conservation-Act-of-Bhutan1995_English_.pdf"
            ],
            "Evidence_Act_2005": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Evidence-Act-of-Bhutan-2005English-version.pdf"
            ],
            "Road_Safety_Act_2013": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Road Act of Bhutan 2013 ( Dzo & Eng).pdf"
            ],
            "Companies_Act_2016": [
                "https://oag.gov.bt/wp-content/uploads/2016/09/The-Companies-Act-2016.pdf"
            ],
            "Domestic_Violence_Prevention_2013": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Domestic Violence Prevention Act 2013.pdf"
            ],
            "Child_Adoption_Act_2012": [
                "https://oag.gov.bt/wp-content/uploads/2010/05/Child Adoption Act 2012.pdf"
            ]
        }
    
    def download_with_retry(self, doc_name, urls, max_retries=3):
        """Download a document with multiple retry attempts and alternative URLs"""
        file_path = self.docs_dir / f"{doc_name}.pdf"
        
        # Check if file already exists
        if file_path.exists() and file_path.stat().st_size > 1000:  # At least 1KB
            print(f"✅ {doc_name} already exists ({file_path.stat().st_size:,} bytes)")
            return True
        
        # Try each URL
        for url_index, url in enumerate(urls):
            print(f"📥 Trying {doc_name} (URL {url_index + 1}/{len(urls)})...")
            
            for attempt in range(max_retries):
                try:
                    # Different user agents to avoid blocking
                    user_agents = [
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ]
                    
                    headers = {
                        'User-Agent': random.choice(user_agents),
                        'Accept': 'application/pdf,application/octet-stream,*/*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    }
                    
                    # Make request with longer timeout
                    response = requests.get(
                        url, 
                        headers=headers, 
                        timeout=60,
                        stream=True,
                        allow_redirects=True
                    )
                    
                    response.raise_for_status()
                    
                    # Check if response looks like a PDF
                    content_type = response.headers.get('content-type', '').lower()
                    if 'pdf' not in content_type and 'application/octet-stream' not in content_type:
                        print(f"⚠️ Warning: Content type is {content_type}, but proceeding...")
                    
                    # Download the file
                    total_size = int(response.headers.get('content-length', 0))
                    
                    with open(file_path, 'wb') as f:
                        if total_size > 0:
                            with tqdm(total=total_size, unit='B', unit_scale=True, desc=f"Downloading {doc_name}") as pbar:
                                for chunk in response.iter_content(chunk_size=8192):
                                    if chunk:
                                        f.write(chunk)
                                        pbar.update(len(chunk))
                        else:
                            # No content-length header
                            for chunk in response.iter_content(chunk_size=8192):
                                if chunk:
                                    f.write(chunk)
                    
                    # Verify file size
                    if file_path.stat().st_size < 1000:  # Less than 1KB is suspicious
                        print(f"⚠️ Downloaded file seems too small: {file_path.stat().st_size} bytes")
                        file_path.unlink()  # Delete the small file
                        continue
                    
                    print(f"✅ Successfully downloaded {doc_name} ({file_path.stat().st_size:,} bytes)")
                    return True
                    
                except requests.exceptions.RequestException as e:
                    print(f"❌ Attempt {attempt + 1}/{max_retries} failed for {doc_name}: {e}")
                    if attempt < max_retries - 1:
                        wait_time = (2 ** attempt) + random.uniform(1, 3)  # Exponential backoff with jitter
                        print(f"⏳ Waiting {wait_time:.1f} seconds before retry...")
                        time.sleep(wait_time)
                    else:
                        print(f"💔 All attempts failed for {doc_name} with URL {url}")
                        break
                
                except Exception as e:
                    print(f"❌ Unexpected error downloading {doc_name}: {e}")
                    break
        
        print(f"💔 Failed to download {doc_name} from all sources")
        return False
    
    def download_all_documents(self):
        """Download all legal documents with enhanced retry logic"""
        print("🇧🇹 Enhanced Bhutan Legal Document Downloader")
        print("=" * 60)
        
        successful_downloads = 0
        failed_downloads = []
        
        # Shuffle the order to avoid overloading one server
        items = list(self.legal_urls.items())
        random.shuffle(items)
        
        for doc_name, urls in items:
            if self.download_with_retry(doc_name, urls):
                successful_downloads += 1
            else:
                failed_downloads.append(doc_name)
            
            # Be respectful to servers
            time.sleep(random.uniform(2, 5))
        
        print("\n" + "=" * 60)
        print(f"📊 Download Summary:")
        print(f"   ✅ Successful: {successful_downloads}/{len(self.legal_urls)}")
        print(f"   ❌ Failed: {len(failed_downloads)}")
        
        if failed_downloads:
            print(f"\n💔 Failed downloads:")
            for doc in failed_downloads:
                print(f"   • {doc}")
            
            print(f"\n🔄 You can try running this script again to retry failed downloads.")
        
        if successful_downloads >= 5:
            print(f"\n🎉 Great! You have {successful_downloads} documents - enough to build a good RAG system!")
        elif successful_downloads >= 2:
            print(f"\n✅ You have {successful_downloads} documents - sufficient to start with!")
        else:
            print(f"\n⚠️ Only {successful_downloads} documents downloaded. You may want to try again later.")
        
        return successful_downloads, failed_downloads

def retry_failed_downloads():
    """Standalone function to retry downloading documents"""
    downloader = EnhancedBhutanDownloader()
    
    print("🔄 Retrying failed downloads...")
    successful, failed = downloader.download_all_documents()
    
    return successful, failed

if __name__ == "__main__":
    # Run the enhanced downloader
    downloader = EnhancedBhutanDownloader()
    successful, failed = downloader.download_all_documents()
    
    if successful >= 2:
        print(f"\n🚀 Ready to proceed with RAG system setup!")
        print(f"You can now run your main bhutan_legal_rag.py script.")
    else:
        print(f"\n🔄 Try running this script again to get more documents.")