#!/usr/bin/env python3
"""
Complete Flask API for Bhutan Legal RAG System
Works with the HTML frontend and persistent RAG system
"""

from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import threading
import os
import json
import time
import logging
from pathlib import Path
from datetime import datetime
import requests
import hashlib

# Import the persistent RAG system
from persistent_bhutan_rag import PersistentBhutanRAG

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for tracking status
download_status = {
    "is_downloading": False,
    "progress": 0,
    "total_documents": 0,
    "successful_downloads": 0,
    "failed_downloads": [],
    "current_document": "",
    "start_time": None,
    "end_time": None,
    "logs": []
}

rag_setup_status = {
    "is_setup": False,
    "is_setting_up": False,
    "setup_progress": 0,
    "setup_stage": "Not started",
    "error": None,
    "setup_time": None
}

# Initialize RAG system
rag_system = None

# Legal document URLs (same as in your persistent system)
LEGAL_DOCUMENT_URLS = {
    "Constitution_2008": [
        "https://oag.gov.bt/wp-content/uploads/2010/05/Constitution_of_Bhutan.pdf",
        "https://www.constituteproject.org/constitution/Bhutan_2008.pdf",
        "https://www.nationalcouncil.bt/assets/uploads/docs/acts/2017/Constitution_of_Bhutan_2008.pdf"
    ],
    "Anti_Corruption_Act_2011": [
        "https://oag.gov.bt/wp-content/uploads/2010/05/Anti Corruption Act 2011.pdf"
    ],
    "Penal_Code_2004": [
        "https://oag.gov.bt/wp-content/uploads/2010/05/Penal-Code-of-Bhutan-2004_English-version_.pdf"
    ],
    "Civil_Criminal_Procedure_2001": [
        "https://oag.gov.bt/wp-content/uploads/2010/05/Civil-and-Criminal-Procedure-Code-of-Bhutan-2001English-version0.pdf"
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
    "Evidence_Act_2005": [
        "https://oag.gov.bt/wp-content/uploads/2010/05/Evidence-Act-of-Bhutan-2005English-version.pdf"
    ]
}

# Data directory
DATA_DIR = Path("bhutan_legal_data")
DOCS_DIR = DATA_DIR / "documents"
DOCS_DIR.mkdir(parents=True, exist_ok=True)

def log_message(message):
    """Add a log message to the status"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    download_status["logs"].append(log_entry)
    logger.info(message)
    
    # Keep only last 100 log entries
    if len(download_status["logs"]) > 100:
        download_status["logs"] = download_status["logs"][-100:]

def download_document_with_retry(doc_name, urls, max_retries=3):
    """Download a document with retry logic"""
    file_path = DOCS_DIR / f"{doc_name}.pdf"
    
    # Check if file already exists
    if file_path.exists() and file_path.stat().st_size > 1000:
        log_message(f"✅ {doc_name} already exists ({file_path.stat().st_size:,} bytes)")
        return True
    
    for url_index, url in enumerate(urls):
        log_message(f"📥 Trying {doc_name} (URL {url_index + 1}/{len(urls)})...")
        
        for attempt in range(max_retries):
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/pdf,application/octet-stream,*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
                
                response = requests.get(url, headers=headers, timeout=60, stream=True)
                response.raise_for_status()
                
                # Download the file
                with open(file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                
                # Verify file size
                if file_path.stat().st_size < 1000:
                    log_message(f"⚠️ Downloaded file seems too small: {file_path.stat().st_size} bytes")
                    file_path.unlink()
                    continue
                
                log_message(f"✅ Successfully downloaded {doc_name} ({file_path.stat().st_size:,} bytes)")
                return True
                
            except Exception as e:
                log_message(f"❌ Attempt {attempt + 1}/{max_retries} failed for {doc_name}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
        
        log_message(f"💔 Failed to download {doc_name} from URL {url}")
    
    return False

def download_documents_background():
    """Background function to download documents"""
    global download_status
    
    try:
        download_status["is_downloading"] = True
        download_status["start_time"] = datetime.now().isoformat()
        download_status["progress"] = 0
        download_status["successful_downloads"] = 0
        download_status["failed_downloads"] = []
        download_status["total_documents"] = len(LEGAL_DOCUMENT_URLS)
        
        log_message("Starting document download process...")
        
        successful_downloads = 0
        failed_downloads = []
        
        for i, (doc_name, urls) in enumerate(LEGAL_DOCUMENT_URLS.items()):
            download_status["current_document"] = doc_name
            download_status["progress"] = int((i / len(LEGAL_DOCUMENT_URLS)) * 100)
            
            log_message(f"Downloading {doc_name}...")
            
            if download_document_with_retry(doc_name, urls):
                successful_downloads += 1
                log_message(f"✅ Successfully downloaded {doc_name}")
            else:
                failed_downloads.append(doc_name)
                log_message(f"❌ Failed to download {doc_name}")
            
            download_status["successful_downloads"] = successful_downloads
            download_status["failed_downloads"] = failed_downloads
            
            # Be respectful to servers
            time.sleep(2)
        
        download_status["progress"] = 100
        download_status["current_document"] = ""
        download_status["end_time"] = datetime.now().isoformat()
        
        log_message(f"Download process completed. Success: {successful_downloads}, Failed: {len(failed_downloads)}")
        
    except Exception as e:
        log_message(f"Error during download process: {str(e)}")
    finally:
        download_status["is_downloading"] = False

def setup_rag_system_background():
    """Background function to setup RAG system"""
    global rag_system, rag_setup_status
    
    try:
        rag_setup_status["is_setting_up"] = True
        rag_setup_status["setup_progress"] = 0
        rag_setup_status["setup_stage"] = "Initializing..."
        rag_setup_status["error"] = None
        
        log_message("Starting RAG system setup...")
        
        # Initialize RAG system
        rag_setup_status["setup_stage"] = "Creating RAG system..."
        rag_setup_status["setup_progress"] = 10
        rag_system = PersistentBhutanRAG()
        
        # Check if documents exist
        rag_setup_status["setup_stage"] = "Checking documents..."
        rag_setup_status["setup_progress"] = 20
        pdf_files = list(DOCS_DIR.glob("*.pdf"))
        
        if len(pdf_files) == 0:
            log_message("No documents found. Please download documents first.")
            rag_setup_status["error"] = "No documents found. Please download documents first."
            return
        
        # Initialize the system (this uses the persistent caching)
        rag_setup_status["setup_stage"] = "Initializing AI system..."
        rag_setup_status["setup_progress"] = 40
        
        if rag_system.initialize_system():
            rag_setup_status["setup_progress"] = 100
            rag_setup_status["setup_stage"] = "Complete"
            rag_setup_status["is_setup"] = True
            rag_setup_status["setup_time"] = datetime.now().isoformat()
            
            log_message("RAG system setup completed successfully!")
        else:
            log_message("RAG system setup failed during initialization")
            rag_setup_status["error"] = "System initialization failed"
        
    except Exception as e:
        log_message(f"RAG system setup failed: {str(e)}")
        rag_setup_status["error"] = str(e)
    finally:
        rag_setup_status["is_setting_up"] = False

# API Routes

@app.route('/')
def serve_frontend():
    """Serve the frontend HTML"""
    try:
        return send_file('frontend.html')
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Frontend not found",
            "message": "Please ensure frontend.html exists in the project directory"
        }), 404

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "status": "healthy",
        "service": "Bhutan Legal RAG API",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/documents')
def get_available_documents():
    """Get list of available documents"""
    try:
        documents = []
        for doc_name, urls in LEGAL_DOCUMENT_URLS.items():
            file_path = DOCS_DIR / f"{doc_name}.pdf"
            is_downloaded = file_path.exists() and file_path.stat().st_size > 1000
            file_size = file_path.stat().st_size if is_downloaded else 0
            
            documents.append({
                "name": doc_name,
                "display_name": doc_name.replace("_", " "),
                "urls": urls,
                "is_downloaded": is_downloaded,
                "file_size": file_size,
                "file_path": str(file_path) if is_downloaded else None
            })
        
        return jsonify({
            "success": True,
            "documents": documents,
            "total_count": len(documents),
            "downloaded_count": sum(1 for doc in documents if doc["is_downloaded"])
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/download/start', methods=['POST'])
def start_download():
    """Start downloading all documents"""
    global download_status
    
    if download_status["is_downloading"]:
        return jsonify({
            "success": False,
            "error": "Download already in progress"
        }), 400
    
    try:
        # Start download in background thread
        thread = threading.Thread(target=download_documents_background)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            "success": True,
            "message": "Download started",
            "status": "started"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/download/status')
def get_download_status():
    """Get current download status"""
    return jsonify({
        "success": True,
        "status": download_status
    })

@app.route('/api/download/logs')
def get_download_logs():
    """Get download logs"""
    return jsonify({
        "success": True,
        "logs": download_status["logs"]
    })

@app.route('/api/documents/<doc_name>/download')
def download_document_file(doc_name):
    """Download a specific document file"""
    try:
        file_path = DOCS_DIR / f"{doc_name}.pdf"
        
        if not file_path.exists():
            return jsonify({
                "success": False,
                "error": "Document not found"
            }), 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f"{doc_name}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/documents/<doc_name>', methods=['DELETE'])
def delete_document(doc_name):
    """Delete a specific document"""
    try:
        file_path = DOCS_DIR / f"{doc_name}.pdf"
        
        if file_path.exists():
            file_path.unlink()
            log_message(f"Deleted document: {doc_name}")
            return jsonify({
                "success": True,
                "message": f"Document {doc_name} deleted"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Document not found"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/storage/info')
def get_storage_info():
    """Get storage information"""
    try:
        total_files = len(list(DOCS_DIR.glob("*.pdf")))
        total_size = sum(f.stat().st_size for f in DOCS_DIR.glob("*.pdf"))
        
        return jsonify({
            "success": True,
            "storage": {
                "documents_directory": str(DOCS_DIR),
                "total_files": total_files,
                "total_size_bytes": total_size,
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "available_documents": len(LEGAL_DOCUMENT_URLS)
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/rag/setup', methods=['POST'])
def setup_rag_system():
    """Setup the RAG system"""
    global rag_setup_status
    
    if rag_setup_status["is_setting_up"]:
        return jsonify({
            "success": False,
            "error": "RAG system setup already in progress"
        }), 400
    
    if rag_setup_status["is_setup"]:
        return jsonify({
            "success": False,
            "error": "RAG system already setup"
        }), 400
    
    try:
        # Start setup in background thread
        thread = threading.Thread(target=setup_rag_system_background)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            "success": True,
            "message": "RAG system setup started",
            "status": "started"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/rag/status')
def get_rag_status():
    """Get RAG system status"""
    return jsonify({
        "success": True,
        "status": rag_setup_status
    })

@app.route('/api/chat', methods=['POST'])
def chat_with_rag():
    """Chat with the RAG system"""
    global rag_system
    
    if not rag_setup_status["is_setup"]:
        return jsonify({
            "success": False,
            "error": "RAG system not setup. Please setup the system first.",
            "setup_required": True
        }), 400
    
    if not rag_system:
        return jsonify({
            "success": False,
            "error": "RAG system not available"
        }), 500
    
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({
                "success": False,
                "error": "Question is required"
            }), 400
        
        # Get answer from RAG system
        result = rag_system.ask_legal_question(question)
        
        return jsonify({
            "success": True,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/chat/suggestions')
def get_chat_suggestions():
    """Get suggested questions for chat"""
    suggestions = [
        "What are the fundamental rights in Bhutan's Constitution?",
        "What is the penalty for corruption in Bhutan?",
        "How is land ownership regulated in Bhutan?",
        "What are the environmental protection laws?",
        "What is the legal procedure for elections in Bhutan?",
        "What are the citizenship requirements in Bhutan?",
        "How are elections conducted in Bhutan?",
        "What are the penalties for environmental violations?",
        "What rights do workers have in Bhutan?",
        "What is the structure of Bhutan's government?",
        "What are the tax laws in Bhutan?",
        "How is the judicial system organized in Bhutan?",
        "What are the duties of citizens in Bhutan?",
        "How does the anti-corruption law work in Bhutan?",
        "What are the requirements for starting a business in Bhutan?"
    ]
    
    return jsonify({
        "success": True,
        "suggestions": suggestions
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    # Ensure documents directory exists
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("🇧🇹 Bhutan Legal RAG System API")
    print("=" * 50)
    print("🌐 Frontend: http://localhost:5000/")
    print("📋 API Endpoints:")
    print("  GET  /                               - Web Frontend")
    print("  GET  /api/health                     - Health check")
    print("  GET  /api/documents                  - List documents")
    print("  POST /api/download/start             - Start download")
    print("  GET  /api/download/status            - Download status")
    print("  GET  /api/download/logs              - Download logs")
    print("  GET  /api/documents/<name>/download  - Download file")
    print("  DEL  /api/documents/<name>           - Delete document")
    print("  GET  /api/storage/info               - Storage info")
    print("  POST /api/rag/setup                 - Setup AI system")
    print("  GET  /api/rag/status                - AI status")
    print("  POST /api/chat                      - Chat with AI")
    print("  GET  /api/chat/suggestions          - Chat suggestions")
    print("=" * 50)
    print("🚀 Open http://localhost:5000/ in your browser!")
    print("💡 Optional: Set GEMINI_API_KEY for enhanced AI responses")
    
    app.run(debug=True, host='0.0.0.0', port=5001)