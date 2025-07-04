#!/usr/bin/env python3
"""
Complete Bhutan Legal RAG System - M1 MacBook Optimized
Save this as: bhutan_legal_rag.py
Run with: python bhutan_legal_rag.py
"""

import os
import sys
import time
import json
import requests
import torch
import gc
from pathlib import Path
from typing import List, Dict, Tuple
from tqdm import tqdm

def setup_m1_device():
    """Setup optimal device for M1 Mac"""
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print("🚀 Using M1 GPU acceleration (Metal Performance Shaders)")
    else:
        device = torch.device("cpu")
        print("💻 Using CPU (MPS not available)")
    
    # Optimize for M1
    torch.set_num_threads(8)
    if torch.backends.mps.is_available():
        torch.mps.empty_cache()
    
    return device

class BhutanLegalRAG:
    def __init__(self, data_dir="bhutan_legal_data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.docs_dir = self.data_dir / "documents"
        self.docs_dir.mkdir(exist_ok=True)
        
        self.device = setup_m1_device()
        
        # Initialize components
        self.embedding_model = None
        self.vector_db = None
        self.language_model = None
        self.tokenizer = None
        
        # Bhutan legal document URLs
        self.legal_urls = {
            "Constitution_2008": "https://oag.gov.bt/wp-content/uploads/2010/05/Constitution_of_Bhutan.pdf",
            "Penal_Code_2004": "https://oag.gov.bt/wp-content/uploads/2010/05/Penal-Code-of-Bhutan-2004_English-version_.pdf",
            "Civil_Criminal_Procedure_2001": "https://oag.gov.bt/wp-content/uploads/2010/05/Civil-and-Criminal-Procedure-Code-of-Bhutan-2001English-version0.pdf",
            "Anti_Corruption_Act_2011": "https://oag.gov.bt/wp-content/uploads/2010/05/Anti Corruption Act 2011.pdf",
            "Land_Act_2007": "https://oag.gov.bt/wp-content/uploads/2010/05/Land-Act-of-Bhutan-2007_English.pdf",
            "Labour_Employment_Act_2007": "https://oag.gov.bt/wp-content/uploads/2010/05/Labour-and-Employment-Act-of-Bhutan-2007Both-Dzongkha-English.pdf",
            "Civil_Service_Act_2010": "https://oag.gov.bt/wp-content/uploads/2010/05/Civil-Service-Act-of-Bhutan-2010-English-and-Dzongkha.pdf",
            "Tax_Act_2022": "https://oag.gov.bt/wp-content/uploads/2023/01/Tax-Act-of-Bhutan-2022.pdf",
            "Environment_Protection_Act_2007": "https://oag.gov.bt/wp-content/uploads/2010/05/National-Environment-Protection-Act-of-Bhutan-2007English-version.pdf",
            "Election_Act_2008": "https://oag.gov.bt/wp-content/uploads/2010/05/Election-Act-of-Bhutan-2008both-Dzongkha-English.pdf",
            "Judicial_Service_Act_2007": "https://oag.gov.bt/wp-content/uploads/2010/05/Judicial-Service-Act-of-Bhutan-2007English-version.pdf",
            "Immigration_Act_2007": "https://oag.gov.bt/wp-content/uploads/2010/05/Immigration-Act-of-the-Kingdom-of-Bhutan2007-English.pdf",
            "Tobacco_Control_Act_2010": "https://oag.gov.bt/wp-content/uploads/2010/05/Tobacco-Control-Act-of-Bhutan-2010-both-Dzongkha-English.pdf"
        }
    
    def download_legal_documents(self):
        """Download Bhutan legal documents"""
        print("📥 Downloading Bhutan legal documents...")
        downloaded = 0
        
        for doc_name, url in tqdm(self.legal_urls.items(), desc="Downloading"):
            file_path = self.docs_dir / f"{doc_name}.pdf"
            
            if file_path.exists():
                print(f"✅ {doc_name} already exists")
                downloaded += 1
                continue
            
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
                
                print(f"⬇️ Downloading {doc_name}...")
                response = requests.get(url, headers=headers, timeout=30)
                response.raise_for_status()
                
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Downloaded {doc_name} ({len(response.content):,} bytes)")
                downloaded += 1
                time.sleep(1)  # Be respectful to server
                
            except Exception as e:
                print(f"❌ Failed to download {doc_name}: {e}")
        
        print(f"🎉 Downloaded {downloaded}/{len(self.legal_urls)} documents")
        return downloaded
    
    def extract_text_from_pdfs(self):
        """Extract text from PDF documents"""
        import PyPDF2
        
        print("📄 Extracting text from PDFs...")
        legal_texts = {}
        
        pdf_files = list(self.docs_dir.glob("*.pdf"))
        
        for pdf_file in tqdm(pdf_files, desc="Processing PDFs"):
            try:
                text = ""
                with open(pdf_file, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    
                    for page_num, page in enumerate(pdf_reader.pages):
                        try:
                            page_text = page.extract_text()
                            if page_text:
                                text += page_text + "\n"
                        except Exception as e:
                            print(f"⚠️ Error reading page {page_num + 1} of {pdf_file.name}: {e}")
                            continue
                
                if text.strip():
                    legal_texts[pdf_file.stem] = text
                    word_count = len(text.split())
                    print(f"✅ {pdf_file.name}: {word_count:,} words extracted")
                else:
                    print(f"⚠️ No text extracted from {pdf_file.name}")
                
            except Exception as e:
                print(f"❌ Error processing {pdf_file.name}: {e}")
        
        print(f"📚 Successfully processed {len(legal_texts)} documents")
        return legal_texts
    
    def create_text_chunks(self, legal_texts):
        """Create text chunks for processing"""
        print("✂️ Creating text chunks...")
        
        def split_text(text, chunk_size=1000, overlap=200):
            """Simple text splitter"""
            words = text.split()
            chunks = []
            
            for i in range(0, len(words), chunk_size - overlap):
                chunk_words = words[i:i + chunk_size]
                chunk = " ".join(chunk_words)
                chunks.append(chunk)
                
                if i + chunk_size >= len(words):
                    break
            
            return chunks
        
        all_chunks = []
        metadata = []
        
        for doc_name, text in legal_texts.items():
            chunks = split_text(text)
            
            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                metadata.append({
                    "document": doc_name,
                    "chunk_id": i,
                    "total_chunks": len(chunks)
                })
        
        print(f"📦 Created {len(all_chunks)} text chunks")
        return all_chunks, metadata
    
    def setup_embedding_model(self):
        """Setup embedding model"""
        try:
            from sentence_transformers import SentenceTransformer
            
            print("📊 Loading embedding model...")
            model_name = "all-MiniLM-L6-v2"
            
            # Try to use M1 optimization
            if str(self.device) == "mps":
                try:
                    self.embedding_model = SentenceTransformer(model_name, device=self.device)
                    print("✅ Embedding model loaded with M1 GPU acceleration!")
                except Exception as e:
                    print(f"⚠️ M1 GPU failed, using CPU: {e}")
                    self.embedding_model = SentenceTransformer(model_name, device="cpu")
            else:
                self.embedding_model = SentenceTransformer(model_name, device="cpu")
                print("✅ Embedding model loaded on CPU!")
            
        except ImportError:
            print("⚠️ sentence-transformers not available, using basic embeddings")
            # Fallback to basic transformers
            from transformers import AutoTokenizer, AutoModel
            
            model_name = "sentence-transformers/all-MiniLM-L6-v2"
            self.tokenizer_embed = AutoTokenizer.from_pretrained(model_name)
            self.model_embed = AutoModel.from_pretrained(model_name)
            
            if str(self.device) == "mps":
                self.model_embed = self.model_embed.to(self.device)
            
            def encode_texts(texts):
                if isinstance(texts, str):
                    texts = [texts]
                
                inputs = self.tokenizer_embed(texts, padding=True, truncation=True, 
                                            max_length=512, return_tensors='pt')
                
                if str(self.device) == "mps":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                with torch.no_grad():
                    outputs = self.model_embed(**inputs)
                    embeddings = outputs.last_hidden_state.mean(dim=1)
                    
                    if str(self.device) == "mps":
                        embeddings = embeddings.cpu()
                
                return embeddings.numpy()
            
            # Create mock SentenceTransformer-like object
            self.embedding_model = type('EmbeddingModel', (), {'encode': encode_texts})()
            print("✅ Fallback embedding model loaded!")
    
    def setup_vector_database(self, chunks, metadata):
        """Setup vector database"""
        try:
            import chromadb
            
            print("🗄️ Setting up vector database...")
            
            # Create persistent client
            persist_directory = str(self.data_dir / "chromadb")
            client = chromadb.PersistentClient(path=persist_directory)
            
            # Try to get existing collection
            try:
                collection = client.get_collection("bhutan_legal_docs")
                print("📚 Found existing vector database")
                self.vector_db = collection
                return
            except:
                # Create new collection
                collection = client.create_collection(
                    name="bhutan_legal_docs",
                    metadata={"hnsw:space": "cosine"}
                )
            
            # Add documents in batches
            batch_size = 50  # Smaller batches for stability
            
            for i in tqdm(range(0, len(chunks), batch_size), desc="Creating embeddings"):
                batch_chunks = chunks[i:i+batch_size]
                batch_metadata = metadata[i:i+batch_size]
                
                # Generate embeddings
                embeddings = self.embedding_model.encode(batch_chunks)
                
                # Convert to list format
                if hasattr(embeddings, 'tolist'):
                    embeddings_list = embeddings.tolist()
                elif hasattr(embeddings, 'cpu'):
                    embeddings_list = embeddings.cpu().numpy().tolist()
                else:
                    embeddings_list = embeddings
                
                # Add to collection
                collection.add(
                    embeddings=embeddings_list,
                    documents=batch_chunks,
                    metadatas=batch_metadata,
                    ids=[f"chunk_{i+j}" for j in range(len(batch_chunks))]
                )
                
                # Clear cache on M1
                if str(self.device) == "mps":
                    torch.mps.empty_cache()
                
                gc.collect()
            
            self.vector_db = collection
            print("✅ Vector database created successfully!")
            
        except Exception as e:
            print(f"❌ Vector database setup failed: {e}")
            print("📝 Using simple search fallback...")
            self.vector_db = None
            self.chunks_fallback = chunks
            self.metadata_fallback = metadata
    
    def setup_language_model(self):
        """Setup language model for response generation"""
        try:
            from transformers import AutoTokenizer, AutoModelForCausalLM
            
            print("🧠 Loading language model...")
            
            # Use a smaller model for better M1 compatibility
            model_name = "microsoft/DialoGPT-small"
            
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            self.language_model = AutoModelForCausalLM.from_pretrained(
                model_name,
                low_cpu_mem_usage=True
            )
            
            # Move to M1 GPU if available
            if str(self.device) == "mps":
                try:
                    self.language_model = self.language_model.to(self.device)
                    print("✅ Language model loaded with M1 GPU acceleration!")
                except Exception as e:
                    print(f"⚠️ M1 GPU failed for language model, using CPU: {e}")
            else:
                print("✅ Language model loaded on CPU!")
            
        except Exception as e:
            print(f"⚠️ Language model setup failed: {e}")
            self.language_model = None
    
    def search_legal_documents(self, query, k=5):
        """Search for relevant legal documents"""
        if self.vector_db:
            try:
                # Vector search
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
                print(f"⚠️ Vector search failed: {e}")
        
        # Fallback to simple text search
        if hasattr(self, 'chunks_fallback'):
            print("📝 Using simple text search...")
            query_words = query.lower().split()
            scored_chunks = []
            
            for i, chunk in enumerate(self.chunks_fallback):
                score = sum(1 for word in query_words if word in chunk.lower())
                if score > 0:
                    scored_chunks.append((score, chunk, self.metadata_fallback[i]))
            
            scored_chunks.sort(reverse=True, key=lambda x: x[0])
            top_results = scored_chunks[:k]
            
            docs = [chunk for _, chunk, _ in top_results]
            metadata = [meta for _, _, meta in top_results]
            
            return docs, metadata
        
        return [], []
    
    def generate_legal_response(self, query, context_docs):
        """Generate legal response"""
        if not context_docs:
            return "No relevant legal information found in Bhutan's legal database."
        
        if not self.language_model:
            return f"Based on Bhutan's legal framework: {context_docs[0][:200]}..."
        
        try:
            # Prepare context
            context = " ".join(context_docs[:2])[:800]  # Limit context length
            
            prompt = f"""Based on Bhutan's legal documents:

Context: {context}

Question: {query}

Answer:"""
            
            # Generate response
            inputs = self.tokenizer.encode(prompt, return_tensors="pt", max_length=512, truncation=True)
            
            if str(self.device) == "mps":
                inputs = inputs.to(self.device)
            
            with torch.no_grad():
                outputs = self.language_model.generate(
                    inputs,
                    max_new_tokens=100,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            answer = response[len(prompt):].strip()
            
            if str(self.device) == "mps":
                torch.mps.empty_cache()
            
            return answer if answer else "Please refer to the relevant legal provisions in Bhutan's legal framework."
            
        except Exception as e:
            print(f"⚠️ Generation error: {e}")
            return f"Based on Bhutan's legal documents: {context_docs[0][:200]}..."
    
    def ask_legal_question(self, question):
        """Ask a question about Bhutan's legal system"""
        print(f"\n🔍 Searching: {question}")
        
        # Search for relevant documents
        relevant_docs, metadata = self.search_legal_documents(question)
        
        if not relevant_docs:
            return {
                "question": question,
                "answer": "No relevant legal information found.",
                "sources": []
            }
        
        # Generate answer
        answer = self.generate_legal_response(question, relevant_docs)
        
        # Get unique sources
        sources = list(set(meta.get('document', 'Unknown') for meta in metadata))
        
        return {
            "question": question,
            "answer": answer,
            "sources": sources,
            "relevant_excerpts": relevant_docs[:2]
        }
    
    def setup_complete_system(self):
        """Setup the complete RAG system"""
        print("🇧🇹 Setting up Bhutan Legal RAG System...")
        print("=" * 60)
        
        # Download documents
        downloaded = self.download_legal_documents()
        if downloaded == 0:
            print("❌ No documents downloaded. Cannot proceed.")
            return False
        
        # Extract text
        legal_texts = self.extract_text_from_pdfs()
        if not legal_texts:
            print("❌ No text extracted. Cannot proceed.")
            return False
        
        # Create chunks
        chunks, metadata = self.create_text_chunks(legal_texts)
        
        # Setup AI components
        self.setup_embedding_model()
        self.setup_vector_database(chunks, metadata)
        self.setup_language_model()
        
        print("\n✅ Bhutan Legal RAG System Ready!")
        print("=" * 40)
        print(f"📊 System Statistics:")
        print(f"   • Documents processed: {len(legal_texts)}")
        print(f"   • Text chunks created: {len(chunks)}")
        print(f"   • Device: {self.device}")
        print(f"   • Vector database: {'✅ Active' if self.vector_db else '❌ Fallback mode'}")
        print(f"   • Language model: {'✅ Active' if self.language_model else '❌ Simple responses'}")
        
        return True

def main():
    """Main function"""
    print("🍎 Bhutan Legal RAG System - M1 MacBook Edition")
    print("=" * 50)
    
    # Create and setup system
    rag_system = BhutanLegalRAG()
    
    if not rag_system.setup_complete_system():
        print("❌ System setup failed!")
        return
    
    # Test questions
    test_questions = [
        "What are the fundamental rights in Bhutan's Constitution?",
        "What is the penalty for corruption in Bhutan?",
        "How is land ownership regulated in Bhutan?",
        "What are the environmental protection laws?",
        "What is the legal procedure for elections in Bhutan?"
    ]
    
    print("\n🧪 Testing the system with sample questions...")
    print("=" * 50)
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n📋 Test {i}: {question}")
        result = rag_system.ask_legal_question(question)
        
        print(f"🤖 Answer: {result['answer']}")
        if result['sources']:
            print(f"📚 Sources: {', '.join(result['sources'])}")
        print("-" * 40)
    
    # Interactive mode
    print("\n🎉 System ready! You can now ask questions about Bhutan's laws.")
    print("Type 'quit' to exit, 'help' for commands")
    
    def interactive_mode():
        while True:
            try:
                question = input("\n❓ Ask about Bhutan's law: ").strip()
                
                if question.lower() == 'quit':
                    print("👋 Goodbye!")
                    break
                elif question.lower() == 'help':
                    print("""
🔧 Available commands:
   • Ask any legal question about Bhutan
   • 'quit' - Exit the system
   • 'help' - Show this help
   
📖 Example questions:
   • What are the citizenship requirements?
   • How are elections conducted in Bhutan?
   • What are the penalties for environmental violations?
   • What rights do workers have in Bhutan?
                    """)
                    continue
                elif not question:
                    continue
                
                result = rag_system.ask_legal_question(question)
                print(f"\n🤖 Answer: {result['answer']}")
                
                if result['sources']:
                    print(f"📚 Based on: {', '.join(result['sources'])}")
                
                if result.get('relevant_excerpts'):
                    print(f"\n📖 Relevant excerpts:")
                    for i, excerpt in enumerate(result['relevant_excerpts'][:1], 1):
                        print(f"   {i}. {excerpt[:150]}...")
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    # Start interactive mode
    interactive_mode()
    
    return rag_system

if __name__ == "__main__":
    # Run the complete system
    rag_system = main()