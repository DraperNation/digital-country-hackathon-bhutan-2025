#!/usr/bin/env python3
"""
Persistent Bhutan Legal RAG System
This version saves processed data and only rebuilds when documents change
"""

import os
import sys
import torch
import gc
import json
import pickle
import hashlib
from pathlib import Path
from typing import List, Dict, Tuple
from datetime import datetime
import time

# Gemini API key (optional)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCEIROfUQirqNtK4Np2Gls-qrYIcQqqFdo')

class PersistentBhutanRAG:
    def __init__(self, data_dir="bhutan_legal_data"):
        self.data_dir = Path(data_dir)
        self.docs_dir = self.data_dir / "documents"
        self.cache_dir = self.data_dir / "cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Cache files
        self.texts_cache = self.cache_dir / "legal_texts.json"
        self.chunks_cache = self.cache_dir / "chunks_data.pickle"
        self.embeddings_cache = self.cache_dir / "embeddings.pickle"
        self.vector_db_dir = self.cache_dir / "vector_db"
        self.metadata_cache = self.cache_dir / "system_metadata.json"
        
        # Setup device
        if torch.backends.mps.is_available():
            self.device = torch.device("mps")
            print("🚀 Using M1 GPU")
        else:
            self.device = torch.device("cpu")
            print("💻 Using CPU")
        
        self.embedding_model = None
        self.vector_db = None
        self.gemini_client = None
        
        # Data storage
        self.legal_texts = {}
        self.chunks_with_context = []
        self.metadata_with_context = []
        
        # Setup Gemini (optional)
        self.setup_gemini()
    
    def setup_gemini(self):
        """Setup Google Gemini AI (optional)"""
        try:
            if GEMINI_API_KEY != 'your_gemini_api_key_here':
                from google import genai
                
                # The client gets the API key from the environment variable `GEMINI_API_KEY`
                # or we can pass it directly if set in code
                os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY
                self.gemini_client = genai.Client()
                
                print("✅ Gemini AI configured!")
            else:
                self.gemini_client = None
                print("💡 Gemini AI not configured (set GEMINI_API_KEY for better responses)")
        except ImportError:
            print("⚠️ Google AI package not installed. Run: pip install google-ai-generativelanguage")
            self.gemini_client = None
        except Exception as e:
            print(f"⚠️ Gemini setup failed: {e}")
            self.gemini_client = None
    
    def get_documents_hash(self):
        """Generate hash of all PDF documents to detect changes"""
        pdf_files = sorted(self.docs_dir.glob("*.pdf"))
        hash_content = ""
        
        for pdf_file in pdf_files:
            stat = pdf_file.stat()
            hash_content += f"{pdf_file.name}:{stat.st_size}:{stat.st_mtime}:"
        
        return hashlib.md5(hash_content.encode()).hexdigest()
    
    def save_system_metadata(self, docs_hash, processing_time):
        """Save system metadata"""
        metadata = {
            "documents_hash": docs_hash,
            "processing_time": processing_time,
            "created_at": datetime.now().isoformat(),
            "document_count": len(list(self.docs_dir.glob("*.pdf"))),
            "chunks_count": len(self.chunks_with_context),
            "system_version": "1.0"
        }
        
        with open(self.metadata_cache, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def load_system_metadata(self):
        """Load system metadata"""
        try:
            if self.metadata_cache.exists():
                with open(self.metadata_cache, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"⚠️ Could not load metadata: {e}")
        return None
    
    def is_cache_valid(self):
        """Check if cached data is still valid"""
        try:
            current_hash = self.get_documents_hash()
            metadata = self.load_system_metadata()
            
            if not metadata:
                print("📝 No cache metadata found")
                return False
            
            cached_hash = metadata.get("documents_hash")
            
            if current_hash != cached_hash:
                print("📝 Documents have changed, cache invalid")
                return False
            
            # Check if all cache files exist
            cache_files = [
                self.texts_cache,
                self.chunks_cache,
                self.embeddings_cache
            ]
            
            for cache_file in cache_files:
                if not cache_file.exists():
                    print(f"📝 Cache file missing: {cache_file.name}")
                    return False
            
            print("✅ Cache is valid - loading from saved data")
            return True
            
        except Exception as e:
            print(f"⚠️ Cache validation failed: {e}")
            return False
    
    def save_legal_texts(self, legal_texts):
        """Save extracted legal texts"""
        print("💾 Saving legal texts...")
        with open(self.texts_cache, 'w', encoding='utf-8') as f:
            json.dump(legal_texts, f, ensure_ascii=False, indent=2)
    
    def load_legal_texts(self):
        """Load extracted legal texts"""
        try:
            print("📖 Loading cached legal texts...")
            with open(self.texts_cache, 'r', encoding='utf-8') as f:
                self.legal_texts = json.load(f)
            print(f"✅ Loaded {len(self.legal_texts)} legal documents from cache")
            return self.legal_texts
        except Exception as e:
            print(f"❌ Failed to load legal texts: {e}")
            return {}
    
    def save_chunks_data(self, chunks, metadata):
        """Save chunks and metadata"""
        print("💾 Saving chunks and metadata...")
        data = {
            'chunks': chunks,
            'metadata': metadata
        }
        with open(self.chunks_cache, 'wb') as f:
            pickle.dump(data, f)
    
    def load_chunks_data(self):
        """Load chunks and metadata"""
        try:
            print("📦 Loading cached chunks...")
            with open(self.chunks_cache, 'rb') as f:
                data = pickle.load(f)
            
            self.chunks_with_context = data['chunks']
            self.metadata_with_context = data['metadata']
            
            print(f"✅ Loaded {len(self.chunks_with_context)} chunks from cache")
            return self.chunks_with_context, self.metadata_with_context
        except Exception as e:
            print(f"❌ Failed to load chunks: {e}")
            return [], []
    
    def save_vector_database(self):
        """Save vector database persistently"""
        # ChromaDB handles persistence automatically if we use PersistentClient
        print("💾 Vector database saved automatically")
    
    def setup_persistent_vector_database(self, chunks, metadata):
        """Setup persistent vector database"""
        try:
            import chromadb
            
            print("🗄️ Setting up persistent vector database...")
            
            # Use persistent client - this saves data automatically
            client = chromadb.PersistentClient(path=str(self.vector_db_dir))
            
            try:
                # Try to get existing collection
                collection = client.get_collection("bhutan_legal_docs")
                print("✅ Loaded existing vector database")
                self.vector_db = collection
                return True
            except:
                # Create new collection if it doesn't exist
                print("📊 Creating new vector database...")
                collection = client.create_collection(name="bhutan_legal_docs")
                
                # Add documents in batches
                batch_size = 25
                for i in range(0, len(chunks), batch_size):
                    batch_chunks = chunks[i:i+batch_size]
                    batch_metadata = metadata[i:i+batch_size]
                    
                    print(f"   Processing batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}")
                    
                    embeddings = self.embedding_model.encode(batch_chunks)
                    
                    if hasattr(embeddings, 'tolist'):
                        embeddings_list = embeddings.tolist()
                    elif hasattr(embeddings, 'cpu'):
                        embeddings_list = embeddings.cpu().numpy().tolist()
                    else:
                        embeddings_list = embeddings
                    
                    collection.add(
                        embeddings=embeddings_list,
                        documents=batch_chunks,
                        metadatas=batch_metadata,
                        ids=[f"chunk_{i+j}" for j in range(len(batch_chunks))]
                    )
                    
                    if str(self.device) == "mps":
                        torch.mps.empty_cache()
                
                self.vector_db = collection
                print("✅ Vector database created and saved")
                return True
                
        except Exception as e:
            print(f"❌ Vector database setup failed: {e}")
            self.vector_db = None
            return False
    
    def extract_text_from_pdfs(self):
        """Extract text from PDFs with caching"""
        import PyPDF2
        import re
        
        print("📄 Extracting text from documents...")
        legal_texts = {}
        
        pdf_files = list(self.docs_dir.glob("*.pdf"))
        
        for pdf_file in pdf_files:
            print(f"📖 Processing {pdf_file.name}...")
            
            try:
                text = ""
                with open(pdf_file, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    
                    for page_num, page in enumerate(pdf_reader.pages):
                        try:
                            page_text = page.extract_text()
                            if page_text:
                                # Clean up text
                                page_text = re.sub(r'\s+', ' ', page_text)
                                page_text = re.sub(r'(\w)\s+([.,:;])', r'\1\2', page_text)
                                text += page_text + "\n"
                        except Exception as e:
                            print(f"⚠️ Error reading page {page_num + 1}: {e}")
                            continue
                
                if text.strip():
                    legal_texts[pdf_file.stem] = text
                    word_count = len(text.split())
                    print(f"✅ Extracted {word_count:,} words")
                
            except Exception as e:
                print(f"❌ Error processing {pdf_file.name}: {e}")
        
        # Save extracted texts
        self.save_legal_texts(legal_texts)
        self.legal_texts = legal_texts
        
        return legal_texts
    
    def create_chunks(self, legal_texts):
        """Create text chunks with caching"""
        print("✂️ Creating text chunks...")
        
        all_chunks = []
        metadata = []
        
        for doc_name, text in legal_texts.items():
            # Simple but effective chunking
            chunks = self.chunk_text(text, chunk_size=1200, overlap=200)
            
            for i, chunk in enumerate(chunks):
                if len(chunk.strip()) > 100:
                    all_chunks.append(chunk)
                    metadata.append({
                        "document": doc_name,
                        "chunk_id": i,
                        "total_chunks": len(chunks),
                        "doc_type": self.get_document_type(doc_name)
                    })
        
        # Save chunks
        self.save_chunks_data(all_chunks, metadata)
        self.chunks_with_context = all_chunks
        self.metadata_with_context = metadata
        
        print(f"📦 Created {len(all_chunks)} text chunks")
        return all_chunks, metadata
    
    def chunk_text(self, text, chunk_size=1200, overlap=200):
        """Simple text chunking"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk_words = words[i:i + chunk_size]
            chunk = " ".join(chunk_words)
            if chunk.strip():
                chunks.append(chunk)
            
            if i + chunk_size >= len(words):
                break
        
        return chunks
    
    def get_document_type(self, doc_name):
        """Determine document type"""
        doc_lower = doc_name.lower()
        if "constitution" in doc_lower:
            return "constitution"
        elif "penal" in doc_lower or "criminal" in doc_lower:
            return "criminal_law"
        elif "corruption" in doc_lower:
            return "anti_corruption"
        elif "land" in doc_lower:
            return "land_law"
        elif "tax" in doc_lower:
            return "tax_law"
        elif "environment" in doc_lower:
            return "environmental_law"
        else:
            return "general_law"
    
    def setup_embedding_model(self):
        """Setup embedding model (only once)"""
        try:
            from sentence_transformers import SentenceTransformer
            
            print("📊 Loading embedding model...")
            
            if str(self.device) == "mps":
                try:
                    self.embedding_model = SentenceTransformer(
                        "sentence-transformers/all-mpnet-base-v2", 
                        device=self.device
                    )
                    print("✅ Embedding model loaded with M1 GPU!")
                except Exception as e:
                    print(f"⚠️ M1 GPU failed, using CPU: {e}")
                    self.embedding_model = SentenceTransformer(
                        "sentence-transformers/all-mpnet-base-v2", 
                        device="cpu"
                    )
            else:
                self.embedding_model = SentenceTransformer(
                    "sentence-transformers/all-mpnet-base-v2", 
                    device="cpu"
                )
                print("✅ Embedding model loaded on CPU!")
            
        except Exception as e:
            print(f"❌ Embedding model failed: {e}")
            return False
        
        return True
    
    def search_documents(self, query, k=5):
        """Search for relevant documents"""
        if not self.vector_db:
            return [], []
        
        try:
            query_embedding = self.embedding_model.encode([query])
            
            if hasattr(query_embedding, 'tolist'):
                query_embedding = query_embedding.tolist()
            elif hasattr(query_embedding, 'cpu'):
                query_embedding = query_embedding.cpu().numpy().tolist()
            
            results = self.vector_db.query(
                query_embeddings=query_embedding,
                n_results=k
            )
            
            return results['documents'][0], results['metadatas'][0]
            
        except Exception as e:
            print(f"⚠️ Search failed: {e}")
            return [], []
    
    def generate_response(self, query, context_docs, metadata):
        """Generate response using Gemini or fallback"""
        if not context_docs:
            return "No relevant legal information found."
        
        if self.gemini_client:
            return self.generate_gemini_response(query, context_docs, metadata)
        else:
            return self.generate_fallback_response(query, context_docs, metadata)
    
    def generate_gemini_response(self, query, context_docs, metadata):
        """Generate response using Gemini"""
        try:
            context_text = "\n".join([f"Document: {meta['document']}\nContent: {doc[:800]}..." 
                                    for doc, meta in zip(context_docs[:3], metadata[:3])])
            
            system_prompt = """You are a specialized legal AI assistant for Bhutan's legal system. Your role is to provide accurate, helpful, and well-structured legal information based on Bhutan's official legal documents.

RESPONSE GUIDELINES:
1. **Structure**: Always structure your response with clear sections and bullet points when appropriate
2. **Accuracy**: Only provide information that is directly supported by the provided legal documents
3. **Citations**: Always cite specific documents, articles, or sections when referencing legal provisions
4. **Language**: Use clear, professional legal language that is accessible to both legal professionals and citizens
5. **Completeness**: Provide comprehensive answers that address all aspects of the question
6. **Limitations**: If the provided documents don't contain sufficient information, clearly state this limitation

RESPONSE FORMAT:
- Start with a brief direct answer to the question
- Provide detailed explanation with specific legal provisions
- Use bullet points or numbered lists for multiple requirements/provisions
- Include relevant document citations in format: "[Document Name, Article/Section X]"
- End with any important caveats or additional context

TONE: Professional, authoritative, but accessible. Avoid legal jargon when simpler terms suffice.

IMPORTANT: Base your response ONLY on the provided legal context. Do not add information from your general knowledge about Bhutan's laws."""

            user_prompt = f"""
LEGAL CONTEXT FROM BHUTAN'S OFFICIAL DOCUMENTS:
{context_text}

CITIZEN'S QUESTION: {query}

Please provide a comprehensive legal response following the guidelines above."""

            full_prompt = f"{system_prompt}\n\n{user_prompt}"

            response = self.gemini_client.models.generate_content(
                model="gemini-2.0-flash-exp", 
                contents=full_prompt
            )
            
            if response and response.text:
                return response.text.strip()
        
        except Exception as e:
            print(f"⚠️ Gemini failed: {e}")
        
        return self.generate_fallback_response(query, context_docs, metadata)
    
    def generate_fallback_response(self, query, context_docs, metadata):
        """Generate fallback response"""
        query_lower = query.lower()
        
        # Extract relevant sentences
        for doc, meta in zip(context_docs, metadata):
            sentences = [s.strip() for s in doc.split('.') if len(s.strip()) > 20]
            
            # Find sentences containing query keywords
            query_words = query_lower.split()
            relevant_sentences = []
            
            for sentence in sentences:
                sentence_lower = sentence.lower()
                if any(word in sentence_lower for word in query_words):
                    relevant_sentences.append(sentence)
            
            if relevant_sentences:
                doc_name = meta['document'].replace('_', ' ')
                return f"According to {doc_name}: {'. '.join(relevant_sentences[:2])}."
        
        # Fallback to first chunk
        return f"Based on Bhutan's legal documents: {context_docs[0][:400]}..."
    
    def ask_legal_question(self, question):
        """Ask a legal question"""
        # Search for relevant documents
        relevant_docs, metadata = self.search_documents(question)
        
        if not relevant_docs:
            return {
                "question": question,
                "answer": "No relevant legal information found.",
                "sources": [],
                "ai_powered": False
            }
        
        # Generate response
        answer = self.generate_response(question, relevant_docs, metadata)
        sources = list(set(meta['document'].replace('_', ' ') for meta in metadata))
        
        return {
            "question": question,
            "answer": answer,
            "sources": sources,
            "ai_powered": bool(self.gemini_client)
        }
    
    def initialize_system(self):
        """Initialize the RAG system with caching"""
        print("🇧🇹 Initializing Persistent Bhutan Legal RAG System")
        print("=" * 60)
        
        start_time = time.time()
        
        # Check if we can use cached data
        if self.is_cache_valid():
            print("⚡ Loading from cache...")
            
            # Load cached data
            legal_texts = self.load_legal_texts()
            chunks, metadata = self.load_chunks_data()
            
            if legal_texts and chunks:
                # Setup models
                if not self.setup_embedding_model():
                    return False
                
                # Setup persistent vector database
                if not self.setup_persistent_vector_database(chunks, metadata):
                    return False
                
                print("✅ System loaded from cache in seconds!")
                return True
        
        # Need to process from scratch
        print("🔄 Processing documents from scratch...")
        
        # Check documents exist
        pdf_files = list(self.docs_dir.glob("*.pdf"))
        if not pdf_files:
            print("❌ No PDF documents found!")
            return False
        
        # Extract text
        legal_texts = self.extract_text_from_pdfs()
        if not legal_texts:
            print("❌ No text extracted!")
            return False
        
        # Create chunks
        chunks, metadata = self.create_chunks(legal_texts)
        
        # Setup embedding model
        if not self.setup_embedding_model():
            return False
        
        # Setup vector database
        if not self.setup_persistent_vector_database(chunks, metadata):
            return False
        
        # Save metadata
        processing_time = time.time() - start_time
        docs_hash = self.get_documents_hash()
        self.save_system_metadata(docs_hash, processing_time)
        
        print(f"✅ System initialized in {processing_time:.1f} seconds")
        print("💡 Next time it will load much faster from cache!")
        
        return True
    
    def run_interactive_mode(self):
        """Run interactive Q&A mode"""
        print("\n🎉 System ready! Ask questions about Bhutan's laws.")
        print("Commands: 'quit' to exit, 'clear' to rebuild cache, 'stats' for info")
        
        if self.gemini_client:
            print("🚀 Powered by Gemini AI for enhanced responses!")
        else:
            print("💡 Set GEMINI_API_KEY environment variable for AI-powered responses")
        
        while True:
            try:
                question = input("\n❓ Your question: ").strip()
                
                if question.lower() == 'quit':
                    print("👋 Goodbye!")
                    break
                elif question.lower() == 'clear':
                    self.clear_cache()
                    print("🗑️ Cache cleared. Restart to rebuild.")
                    continue
                elif question.lower() == 'stats':
                    self.show_stats()
                    continue
                elif not question:
                    continue
                
                result = self.ask_legal_question(question)
                
                print(f"\n🤖 {'AI-Powered' if result['ai_powered'] else 'Standard'} Response:")
                print(f"{result['answer']}")
                
                if result['sources']:
                    print(f"\n📚 Sources: {', '.join(result['sources'])}")
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def clear_cache(self):
        """Clear all cached data"""
        import shutil
        
        cache_files = [
            self.texts_cache,
            self.chunks_cache,
            self.embeddings_cache,
            self.metadata_cache
        ]
        
        for cache_file in cache_files:
            if cache_file.exists():
                cache_file.unlink()
        
        if self.vector_db_dir.exists():
            shutil.rmtree(self.vector_db_dir)
        
        print("🗑️ All cache cleared")
    
    def show_stats(self):
        """Show system statistics"""
        metadata = self.load_system_metadata()
        
        if metadata:
            print(f"""
📊 System Statistics:
   • Documents: {metadata.get('document_count', 'Unknown')}
   • Text chunks: {metadata.get('chunks_count', 'Unknown')}
   • Cache created: {metadata.get('created_at', 'Unknown')}
   • Processing time: {metadata.get('processing_time', 0):.1f} seconds
   • Gemini AI: {'✅ Active' if self.gemini_client else '❌ Not configured'}
   • Cache location: {self.cache_dir}
            """)
        else:
            print("📊 No statistics available")

def main():
    """Main function"""
    print("🔑 Optional: Set GEMINI_API_KEY environment variable for AI responses")
    print("   export GEMINI_API_KEY='your_key_here'")
    print("   Get key from: https://makersuite.google.com/app/apikey\n")
    
    rag_system = PersistentBhutanRAG()
    
    if rag_system.initialize_system():
        rag_system.run_interactive_mode()
    else:
        print("❌ System initialization failed!")

if __name__ == "__main__":
    main()