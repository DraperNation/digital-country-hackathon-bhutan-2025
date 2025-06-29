#!/usr/bin/env python3
"""
Improved Bhutan Legal RAG System with Better Response Generation
This version generates proper answers using the legal text content
"""

import os
import sys
import torch
import gc
import re
from pathlib import Path
from typing import List, Dict, Tuple
from transformers import pipeline

def setup_m1_device():
    """Setup optimal device for M1 Mac"""
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print("🚀 Using M1 GPU acceleration")
    else:
        device = torch.device("cpu")
        print("💻 Using CPU")
    
    torch.set_num_threads(8)
    if torch.backends.mps.is_available():
        torch.mps.empty_cache()
    
    return device

class ImprovedBhutanRAG:
    def __init__(self, data_dir="bhutan_legal_data"):
        self.data_dir = Path(data_dir)
        self.docs_dir = self.data_dir / "documents"
        self.device = setup_m1_device()
        
        self.embedding_model = None
        self.vector_db = None
        self.qa_pipeline = None
        self.summarizer = None
        
        # Store processed legal texts for better context
        self.legal_texts = {}
        self.chunks_with_context = []
        self.metadata_with_context = []
    
    def check_available_documents(self):
        """Check what documents we have"""
        pdf_files = list(self.docs_dir.glob("*.pdf"))
        
        print(f"📚 Found {len(pdf_files)} documents:")
        for pdf in pdf_files:
            size_mb = pdf.stat().st_size / (1024 * 1024)
            print(f"   ✅ {pdf.name} ({size_mb:.1f} MB)")
        
        return pdf_files
    
    def extract_text_from_pdfs(self, pdf_files):
        """Extract text from PDFs with better processing"""
        import PyPDF2
        
        print("\n📄 Extracting text from documents...")
        legal_texts = {}
        
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
                                # Clean up the text
                                page_text = self.clean_legal_text(page_text)
                                text += page_text + "\n"
                        except Exception as e:
                            print(f"⚠️ Error reading page {page_num + 1}: {e}")
                            continue
                
                if text.strip():
                    legal_texts[pdf_file.stem] = text
                    word_count = len(text.split())
                    print(f"✅ Extracted {word_count:,} words from {pdf_file.name}")
                else:
                    print(f"⚠️ No text extracted from {pdf_file.name}")
                
            except Exception as e:
                print(f"❌ Error processing {pdf_file.name}: {e}")
        
        self.legal_texts = legal_texts
        print(f"\n📚 Successfully processed {len(legal_texts)} documents")
        return legal_texts
    
    def clean_legal_text(self, text):
        """Clean and format legal text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Fix common OCR issues
        text = re.sub(r'(\w)\s+([.,:;])', r'\1\2', text)
        
        # Ensure proper sentence endings
        text = re.sub(r'([.!?])\s*([A-Z])', r'\1 \2', text)
        
        return text.strip()
    
    def create_enhanced_chunks(self, legal_texts):
        """Create enhanced text chunks with better context"""
        print("✂️ Creating enhanced text chunks...")
        
        all_chunks = []
        metadata = []
        
        for doc_name, text in legal_texts.items():
            # Split by sections, articles, or paragraphs
            sections = self.split_legal_document(text, doc_name)
            
            for i, section in enumerate(sections):
                if len(section.strip()) > 50:  # Only include substantial chunks
                    all_chunks.append(section)
                    metadata.append({
                        "document": doc_name,
                        "chunk_id": i,
                        "total_chunks": len(sections),
                        "doc_type": self.get_document_type(doc_name),
                        "content_preview": section[:100] + "..." if len(section) > 100 else section
                    })
        
        self.chunks_with_context = all_chunks
        self.metadata_with_context = metadata
        
        print(f"📦 Created {len(all_chunks)} enhanced text chunks")
        return all_chunks, metadata
    
    def split_legal_document(self, text, doc_name):
        """Split legal document into meaningful sections"""
        # Common legal document patterns
        patterns = [
            r'Article \d+[.:]\s*',  # Article X:
            r'Section \d+[.:]\s*',  # Section X:
            r'Chapter \d+[.:]\s*',  # Chapter X:
            r'\d+\.\s+',           # 1. 2. 3.
            r'\([a-z]\)\s*',       # (a) (b) (c)
            r'\n\n+',              # Paragraph breaks
        ]
        
        # Try to split by legal sections first
        for pattern in patterns:
            sections = re.split(pattern, text)
            if len(sections) > 3:  # If we get good splits
                # Keep the delimiter with the content
                result = []
                matches = re.finditer(pattern, text)
                last_end = 0
                
                for match in matches:
                    if last_end < match.start():
                        result.append(text[last_end:match.start()])
                    last_end = match.end()
                
                if last_end < len(text):
                    result.append(text[last_end:])
                
                # Filter out very short sections
                result = [s for s in result if len(s.strip()) > 100]
                
                if len(result) > 2:
                    return result
        
        # Fallback to simple chunking
        return self.simple_chunk_text(text)
    
    def simple_chunk_text(self, text, chunk_size=1500, overlap=300):
        """Simple text chunking as fallback"""
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
        """Determine document type for better context"""
        if "constitution" in doc_name.lower():
            return "constitution"
        elif "penal" in doc_name.lower() or "criminal" in doc_name.lower():
            return "criminal_law"
        elif "civil" in doc_name.lower():
            return "civil_law"
        elif "corruption" in doc_name.lower():
            return "anti_corruption"
        elif "land" in doc_name.lower():
            return "land_law"
        elif "tax" in doc_name.lower():
            return "tax_law"
        elif "environment" in doc_name.lower():
            return "environmental_law"
        else:
            return "general_law"
    
    def setup_embedding_model(self):
        """Setup embedding model"""
        try:
            from sentence_transformers import SentenceTransformer
            
            print("📊 Loading embedding model...")
            # Use a model optimized for legal text
            model_name = "sentence-transformers/all-mpnet-base-v2"
            
            if str(self.device) == "mps":
                try:
                    self.embedding_model = SentenceTransformer(model_name, device=self.device)
                    print("✅ Embedding model loaded with M1 GPU!")
                except Exception as e:
                    print(f"⚠️ M1 GPU failed, using CPU: {e}")
                    self.embedding_model = SentenceTransformer(model_name, device="cpu")
            else:
                self.embedding_model = SentenceTransformer(model_name, device="cpu")
                print("✅ Embedding model loaded on CPU!")
            
        except Exception as e:
            print(f"⚠️ Embedding model failed: {e}")
            # Fallback implementation
            self.setup_fallback_embeddings()
    
    def setup_fallback_embeddings(self):
        """Setup fallback embedding implementation"""
        from transformers import AutoTokenizer, AutoModel
        
        print("📊 Setting up fallback embeddings...")
        model_name = "sentence-transformers/all-mpnet-base-v2"
        
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
        
        self.embedding_model = type('EmbeddingModel', (), {'encode': encode_texts})()
        print("✅ Fallback embedding model loaded!")
    
    def setup_vector_database(self, chunks, metadata):
        """Setup vector database with better error handling"""
        try:
            import chromadb
            
            print("🗄️ Setting up vector database...")
            
            client = chromadb.Client()
            
            try:
                # Try to delete existing collection
                client.delete_collection("bhutan_legal_docs")
            except:
                pass
            
            collection = client.create_collection(name="bhutan_legal_docs")
            
            # Process in small batches
            batch_size = 20
            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i:i+batch_size]
                batch_metadata = metadata[i:i+batch_size]
                
                print(f"   Processing batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}")
                
                try:
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
                    
                except Exception as e:
                    print(f"⚠️ Error processing batch {i//batch_size + 1}: {e}")
                    continue
            
            self.vector_db = collection
            print("✅ Vector database created successfully!")
            
        except Exception as e:
            print(f"❌ Vector database setup failed: {e}")
            print("📝 Using simple search fallback...")
            self.vector_db = None
    
    def setup_qa_pipeline(self):
        """Setup Question-Answering pipeline for better responses"""
        try:
            print("🧠 Loading Question-Answering model...")
            
            # Use a model specifically designed for Q&A
            self.qa_pipeline = pipeline(
                "question-answering",
                model="deepset/roberta-base-squad2",
                tokenizer="deepset/roberta-base-squad2",
                device=0 if str(self.device) == "mps" else -1
            )
            
            print("✅ Q&A pipeline loaded successfully!")
            
        except Exception as e:
            print(f"⚠️ Q&A pipeline setup failed: {e}")
            
            # Fallback to text generation
            try:
                print("🔄 Setting up text generation fallback...")
                self.qa_pipeline = pipeline(
                    "text-generation",
                    model="microsoft/DialoGPT-small",
                    device=0 if str(self.device) == "mps" else -1
                )
                print("✅ Text generation pipeline loaded!")
                
            except Exception as e:
                print(f"⚠️ All model setups failed: {e}")
                self.qa_pipeline = None
    
    def search_documents(self, query, k=5):
        """Enhanced document search"""
        if self.vector_db:
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
                print(f"⚠️ Vector search failed: {e}")
        
        # Enhanced fallback search
        return self.enhanced_text_search(query, k)
    
    def enhanced_text_search(self, query, k=5):
        """Enhanced text search with better matching"""
        if not hasattr(self, 'chunks_with_context'):
            return [], []
        
        query_words = query.lower().split()
        scored_chunks = []
        
        for i, chunk in enumerate(self.chunks_with_context):
            chunk_lower = chunk.lower()
            
            # Calculate relevance score
            score = 0
            
            # Exact phrase matches (higher weight)
            if query.lower() in chunk_lower:
                score += 10
            
            # Individual word matches
            word_matches = sum(1 for word in query_words if word in chunk_lower)
            score += word_matches * 2
            
            # Context-based scoring
            metadata = self.metadata_with_context[i]
            doc_name = metadata.get('document', '').lower()
            
            # Boost score based on document relevance
            if 'constitution' in query.lower() and 'constitution' in doc_name:
                score += 5
            elif 'corruption' in query.lower() and 'corruption' in doc_name:
                score += 5
            elif 'rights' in query.lower() and 'constitution' in doc_name:
                score += 3
            
            if score > 0:
                scored_chunks.append((score, chunk, metadata))
        
        # Sort by score and take top results
        scored_chunks.sort(reverse=True, key=lambda x: x[0])
        top_results = scored_chunks[:k]
        
        docs = [chunk for _, chunk, _ in top_results]
        metadata = [meta for _, _, meta in top_results]
        
        return docs, metadata
    
    def generate_enhanced_response(self, query, context_docs, metadata):
        """Generate enhanced response using legal context"""
        if not context_docs:
            return "No relevant legal information found in the available documents."
        
        # Combine context intelligently
        combined_context = self.combine_legal_context(context_docs, metadata, query)
        
        if self.qa_pipeline and hasattr(self.qa_pipeline, 'model_name'):
            # Use Q&A pipeline if available
            try:
                result = self.qa_pipeline(
                    question=query,
                    context=combined_context[:2000]  # Limit context length
                )
                
                answer = result.get('answer', '').strip()
                confidence = result.get('score', 0)
                
                if answer and confidence > 0.1:
                    return self.format_legal_answer(answer, context_docs, metadata)
                
            except Exception as e:
                print(f"⚠️ Q&A pipeline error: {e}")
        
        # Fallback to extractive answer generation
        return self.extract_legal_answer(query, context_docs, metadata)
    
    def combine_legal_context(self, context_docs, metadata, query):
        """Intelligently combine legal context"""
        relevant_sections = []
        
        for doc, meta in zip(context_docs, metadata):
            doc_name = meta.get('document', 'Unknown')
            
            # Add document header for context
            section = f"From {doc_name.replace('_', ' ')}:\n{doc}\n"
            relevant_sections.append(section)
        
        return "\n".join(relevant_sections)
    
    def extract_legal_answer(self, query, context_docs, metadata):
        """Extract relevant answer from legal context"""
        query_lower = query.lower()
        
        # Look for specific legal concepts
        if 'rights' in query_lower or 'fundamental' in query_lower:
            return self.extract_rights_info(context_docs, metadata)
        elif 'penalty' in query_lower or 'punishment' in query_lower:
            return self.extract_penalty_info(context_docs, metadata)
        elif 'citizenship' in query_lower:
            return self.extract_citizenship_info(context_docs, metadata)
        elif 'environment' in query_lower:
            return self.extract_environment_info(context_docs, metadata)
        elif 'election' in query_lower:
            return self.extract_election_info(context_docs, metadata)
        else:
            return self.extract_general_info(context_docs, metadata, query)
    
    def extract_rights_info(self, context_docs, metadata):
        """Extract information about rights"""
        for doc, meta in zip(context_docs, metadata):
            if 'constitution' in meta.get('document', '').lower():
                # Look for rights-related content
                sentences = doc.split('.')
                rights_sentences = [s.strip() for s in sentences if 
                                 any(keyword in s.lower() for keyword in ['right', 'freedom', 'liberty', 'shall have'])]
                
                if rights_sentences:
                    return f"According to Bhutan's Constitution, the fundamental rights include: {'. '.join(rights_sentences[:3])}."
        
        # Fallback
        return f"Based on Bhutan's legal documents: {context_docs[0][:200]}..."
    
    def extract_penalty_info(self, context_docs, metadata):
        """Extract information about penalties"""
        for doc, meta in zip(context_docs, metadata):
            # Look for penalty/punishment related content
            sentences = doc.split('.')
            penalty_sentences = [s.strip() for s in sentences if 
                               any(keyword in s.lower() for keyword in ['penalty', 'fine', 'imprisonment', 'punish', 'sentence'])]
            
            if penalty_sentences:
                doc_name = meta.get('document', 'legal document').replace('_', ' ')
                return f"According to {doc_name}: {'. '.join(penalty_sentences[:2])}."
        
        return f"Based on the legal provisions: {context_docs[0][:200]}..."
    
    def extract_citizenship_info(self, context_docs, metadata):
        """Extract citizenship information"""
        for doc, meta in zip(context_docs, metadata):
            sentences = doc.split('.')
            citizenship_sentences = [s.strip() for s in sentences if 
                                   any(keyword in s.lower() for keyword in ['citizen', 'citizenship', 'national', 'domiciled'])]
            
            if citizenship_sentences:
                return f"Regarding citizenship in Bhutan: {'. '.join(citizenship_sentences[:2])}."
        
        return f"Based on Bhutan's legal framework: {context_docs[0][:200]}..."
    
    def extract_environment_info(self, context_docs, metadata):
        """Extract environmental law information"""
        for doc, meta in zip(context_docs, metadata):
            sentences = doc.split('.')
            env_sentences = [s.strip() for s in sentences if 
                           any(keyword in s.lower() for keyword in ['environment', 'forest', 'natural', 'conservation', 'pollution'])]
            
            if env_sentences:
                return f"Bhutan's environmental laws state: {'. '.join(env_sentences[:2])}."
        
        return f"Based on environmental provisions: {context_docs[0][:200]}..."
    
    def extract_election_info(self, context_docs, metadata):
        """Extract election information"""
        for doc, meta in zip(context_docs, metadata):
            sentences = doc.split('.')
            election_sentences = [s.strip() for s in sentences if 
                                any(keyword in s.lower() for keyword in ['election', 'vote', 'ballot', 'candidate', 'assembly'])]
            
            if election_sentences:
                return f"Regarding elections in Bhutan: {'. '.join(election_sentences[:2])}."
        
        return f"Based on election laws: {context_docs[0][:200]}..."
    
    def extract_general_info(self, context_docs, metadata, query):
        """Extract general information"""
        # Find the most relevant sentences
        query_words = query.lower().split()
        best_sentences = []
        
        for doc in context_docs:
            sentences = doc.split('.')
            for sentence in sentences:
                if len(sentence.strip()) > 20:
                    score = sum(1 for word in query_words if word in sentence.lower())
                    if score > 0:
                        best_sentences.append((score, sentence.strip()))
        
        if best_sentences:
            best_sentences.sort(reverse=True, key=lambda x: x[0])
            top_sentences = [s for _, s in best_sentences[:2]]
            return f"According to Bhutan's legal documents: {'. '.join(top_sentences)}."
        
        return f"Based on the available legal text: {context_docs[0][:300]}..."
    
    def format_legal_answer(self, answer, context_docs, metadata):
        """Format the legal answer properly"""
        if len(answer) < 20:
            return self.extract_general_info(context_docs, metadata, "")
        
        # Add source context
        sources = list(set(meta.get('document', 'Unknown').replace('_', ' ') for meta in metadata))
        
        formatted_answer = f"{answer}"
        
        if len(formatted_answer) < 50:
            # If answer is too short, add more context
            formatted_answer += f" {context_docs[0][:200]}..."
        
        return formatted_answer
    
    def ask_legal_question(self, question):
        """Ask a question about Bhutan's legal system"""
        print(f"\n🔍 Searching: {question}")
        
        # Search for relevant documents
        relevant_docs, metadata = self.search_documents(question)
        
        if not relevant_docs:
            return {
                "question": question,
                "answer": "No relevant legal information found in the available documents.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Generate enhanced answer
        answer = self.generate_enhanced_response(question, relevant_docs, metadata)
        
        # Get unique sources
        sources = list(set(meta.get('document', 'Unknown').replace('_', ' ') for meta in metadata))
        
        return {
            "question": question,
            "answer": answer,
            "sources": sources,
            "relevant_excerpts": relevant_docs[:2],
            "confidence": min(len(relevant_docs) / 5.0, 1.0)
        }
    
    def run_enhanced_system(self):
        """Run the enhanced RAG system"""
        print("🇧🇹 Enhanced Bhutan Legal RAG System")
        print("=" * 60)
        
        # Check available documents
        pdf_files = self.check_available_documents()
        
        if not pdf_files:
            print("❌ No PDF documents found!")
            return False
        
        # Extract and process text
        legal_texts = self.extract_text_from_pdfs(pdf_files)
        
        if not legal_texts:
            print("❌ No text extracted!")
            return False
        
        # Create enhanced chunks
        chunks, metadata = self.create_enhanced_chunks(legal_texts)
        
        # Setup AI components
        self.setup_embedding_model()
        self.setup_vector_database(chunks, metadata)
        self.setup_qa_pipeline()
        
        print("\n✅ Enhanced RAG System Ready!")
        print("=" * 40)
        print(f"📊 System Statistics:")
        print(f"   • Documents: {len(legal_texts)}")
        print(f"   • Enhanced chunks: {len(chunks)}")
        print(f"   • Device: {self.device}")
        print(f"   • Q&A Pipeline: {'✅ Active' if self.qa_pipeline else '❌ Basic responses'}")
        
        # Test with enhanced responses
        test_questions = [
            "What are the fundamental rights in Bhutan's Constitution?",
            "What is the penalty for corruption in Bhutan?",
            "What are the citizenship requirements in Bhutan?",
            "How is the government structured in Bhutan?"
        ]
        
        print("\n🧪 Testing enhanced system...")
        print("=" * 40)
        
        for i, question in enumerate(test_questions, 1):
            result = self.ask_legal_question(question)
            
            print(f"\n📋 Test {i}: {question}")
            print(f"🤖 Answer: {result['answer']}")
            if result['sources']:
                print(f"📚 Sources: {', '.join(result['sources'])}")
            print(f"🎯 Confidence: {result['confidence']:.2f}")
        
        # Interactive mode
        print("\n🎉 Enhanced system ready! Ask detailed questions about Bhutan's laws.")
        print("Type 'quit' to exit")
        
        while True:
            try:
                question = input("\n❓ Your question: ").strip()
                
                if question.lower() == 'quit':
                    print("👋 Goodbye!")
                    break
                elif not question:
                    continue
                
                result = self.ask_legal_question(question)
                print(f"\n🤖 Enhanced Answer: {result['answer']}")
                
                if result['sources']:
                    print(f"📚 Based on: {', '.join(result['sources'])}")
                
                print(f"🎯 Confidence: {result['confidence']:.2f}")
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
        
        return True

def main():
    """Main function"""
    rag_system = ImprovedBhutanRAG()
    rag_system.run_enhanced_system()

if __name__ == "__main__":
    main()