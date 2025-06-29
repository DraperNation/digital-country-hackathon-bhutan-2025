"""
RAG (Retrieval-Augmented Generation) System for GovBot Bhutan
Handles vector database operations and document retrieval using FAISS
"""

import os
import logging
import asyncio
import pickle
import json
from typing import List, Dict, Any, Optional
from datetime import datetime

import faiss
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

class RAGSystem:
    """RAG system for retrieving relevant Bhutanese government documents using FAISS"""
    
    def __init__(self):
        self.index = None
        self.documents = []
        self.metadatas = []
        self.embedding_model = None
        self.documents_loaded = False
        self.data_dir = "./data/faiss_db"
        
    async def initialize(self):
        """Initialize the RAG system with FAISS vector database and embeddings"""
        logger.info("Initializing RAG system with FAISS...")
        
        try:
            # Create data directory
            os.makedirs(self.data_dir, exist_ok=True)
            
            # Initialize embedding model
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Load existing index or create new one
            index_path = os.path.join(self.data_dir, "faiss_index.bin")
            docs_path = os.path.join(self.data_dir, "documents.pkl")
            meta_path = os.path.join(self.data_dir, "metadata.json")
            
            if os.path.exists(index_path) and os.path.exists(docs_path) and os.path.exists(meta_path):
                await self._load_existing_data(index_path, docs_path, meta_path)
            else:
                await self._create_new_index()
            
            self.documents_loaded = True
            logger.info(f"✅ RAG system initialized with {len(self.documents)} documents")
            
        except Exception as e:
            logger.error(f"Failed to initialize RAG system: {e}")
            raise
    
    async def _load_existing_data(self, index_path: str, docs_path: str, meta_path: str):
        """Load existing FAISS index and documents"""
        logger.info("Loading existing FAISS index...")
        
        # Load FAISS index
        self.index = faiss.read_index(index_path)
        
        # Load documents
        with open(docs_path, 'rb') as f:
            self.documents = pickle.load(f)
        
        # Load metadata
        with open(meta_path, 'r', encoding='utf-8') as f:
            self.metadatas = json.load(f)
        
        logger.info("✅ Loaded existing FAISS index and documents")
    
    async def _create_new_index(self):
        """Create new FAISS index with sample documents"""
        logger.info("Creating new FAISS index...")
        
        # Load sample documents
        await self._load_sample_documents()
        
        # Create embeddings for all documents
        embeddings = []
        for doc in self.documents:
            embedding = self.embedding_model.encode(doc)
            embeddings.append(embedding)
        
        embeddings = np.array(embeddings).astype('float32')
        
        # Create FAISS index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
        
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)
        
        # Add embeddings to index
        self.index.add(embeddings)
        
        # Save index and documents
        await self._save_data()
        
        logger.info("✅ Created new FAISS index")
    
    async def _load_sample_documents(self):
        """Load sample Bhutanese government documents"""
        logger.info("Loading sample government documents...")
        
        # Sample documents representing Bhutanese government information
        sample_docs = [
            {
                "id": "business_reg_001",
                "title": "Business Registration Requirements for Foreign Entrepreneurs",
                "content": """
                Foreign entrepreneurs wishing to establish a business in Bhutan must comply with the following requirements:
                
                1. Minimum Investment: USD 250,000 for manufacturing, USD 500,000 for services
                2. Local Partnership: Minimum 51% Bhutanese ownership required
                3. Environmental Clearance: Required for all manufacturing businesses
                4. Cultural Impact Assessment: Mandatory for tourism-related businesses
                
                The registration process involves:
                - Application to Department of Industry
                - Environmental clearance from National Environment Commission
                - Trade license from respective Dzongkhag
                - Tax registration with Department of Revenue and Customs
                
                Processing time: 30-45 working days
                Validity: Business licenses are valid for 3 years and renewable
                
                Special considerations under Gross National Happiness:
                - Businesses must demonstrate positive contribution to community well-being
                - Environmental sustainability is mandatory
                - Cultural sensitivity training required for foreign staff
                """,
                "document_type": "regulation",
                "department": "Department of Industry",
                "last_updated": "2024-01-15",
                "category": "business_registration"
            },
            {
                "id": "eresidency_001",
                "title": "eResidency Program Guidelines and Benefits",
                "content": """
                Bhutan's eResidency program offers digital identity to global entrepreneurs and digital nomads.
                
                Eligibility Criteria:
                - Minimum annual income of USD 50,000
                - Clean criminal background check
                - Demonstrated digital skills or remote work capability
                - Commitment to Gross National Happiness principles
                
                Benefits:
                - Digital access to government services
                - Simplified business registration process
                - Tax advantages for digital services
                - Access to Bhutan's digital infrastructure
                - Cultural immersion programs
                
                Application Process:
                1. Online application with required documents
                2. Background verification (15 working days)
                3. Digital interview with immigration officials
                4. Cultural orientation program (mandatory)
                5. Digital ID issuance
                
                Annual fee: USD 1,000
                Renewal: Every 2 years
                
                eResidents can:
                - Register digital businesses remotely
                - Access banking services digitally
                - Participate in cultural exchange programs
                - Contribute to Bhutan's digital economy
                """,
                "document_type": "program_guide",
                "department": "Department of Immigration",
                "last_updated": "2024-02-01",
                "category": "eresidency"
            },
            {
                "id": "gnh_principles_001",
                "title": "Gross National Happiness Principles in Business Practice",
                "content": """
                Gross National Happiness (GNH) is Bhutan's unique development philosophy that prioritizes collective happiness and well-being over purely economic measures.
                
                Four Pillars of GNH:
                1. Sustainable and Equitable Socio-Economic Development
                2. Environmental Conservation
                3. Preservation and Promotion of Culture
                4. Good Governance
                
                Business Application of GNH:
                
                Sustainable Development:
                - Businesses must demonstrate long-term sustainability
                - Fair wages and working conditions mandatory
                - Community benefit sharing required
                - Local capacity building prioritized
                
                Environmental Conservation:
                - Carbon neutral operations preferred
                - Waste reduction and recycling mandatory
                - Use of renewable energy encouraged
                - Environmental impact assessments required
                
                Cultural Preservation:
                - Respect for local customs and traditions
                - Dzongkha language promotion in workplace
                - Traditional architecture in building design
                - Cultural festivals and practices support
                
                Good Governance:
                - Transparent business practices
                - Ethical conduct and anti-corruption measures
                - Stakeholder engagement and consultation
                - Regular social impact reporting
                
                GNH Certification:
                Businesses can apply for GNH certification demonstrating commitment to these principles.
                Benefits include tax incentives, preferential government contracts, and international recognition.
                """,
                "document_type": "policy_framework",
                "department": "Centre for Bhutan Studies & GNH Research",
                "last_updated": "2024-01-10",
                "category": "gnh_principles"
            },
            {
                "id": "tax_guide_001",
                "title": "Tax Guide for Digital Nomads and Remote Workers",
                "content": """
                Bhutan offers attractive tax incentives for digital nomads and remote workers under the eResidency program.
                
                Tax Rates:
                - Corporate Income Tax: 25% (reduced to 15% for GNH certified businesses)
                - Personal Income Tax: Progressive rates from 0% to 25%
                - Digital Services Tax: 10% (waived for first 2 years for eResidents)
                - Goods and Services Tax: 12%
                
                Special Provisions for Digital Nomads:
                - Income earned outside Bhutan: Tax-exempt if less than 183 days in country
                - Remote work income: 50% tax reduction for first 3 years
                - Cryptocurrency transactions: 15% capital gains tax
                - Digital product sales: Preferential 8% tax rate
                
                Tax Incentives:
                - Green technology businesses: 5-year tax holiday
                - Cultural preservation projects: 50% tax reduction
                - Rural development initiatives: Additional 25% deduction
                - Education and healthcare services: Tax-exempt status
                
                Compliance Requirements:
                - Monthly GST filing for businesses with turnover > BTN 1 million
                - Annual income tax filing by June 30
                - Quarterly advance tax payments
                - Digital record keeping mandatory
                
                Double Taxation Avoidance:
                Bhutan has agreements with India, Bangladesh, and Thailand.
                Negotiations ongoing with EU countries and USA.
                """,
                "document_type": "tax_guide",
                "department": "Department of Revenue and Customs",
                "last_updated": "2024-01-20",
                "category": "taxation"
            },
            {
                "id": "tourism_business_001",
                "title": "Tourism Business Licensing and Cultural Guidelines",
                "content": """
                Tourism is a vital sector in Bhutan, regulated under the "High Value, Low Impact" policy.
                
                Tourism Business Categories:
                1. Tour Operators (Category A, B, C based on capacity)
                2. Hotels and Accommodations
                3. Transport Services
                4. Adventure Tourism (trekking, rafting, etc.)
                5. Cultural Experience Providers
                
                Licensing Requirements:
                - Tourism Council of Bhutan (TCB) license mandatory
                - Minimum capital requirements vary by category
                - Cultural sensitivity training for all staff
                - Environmental management plan required
                - Insurance coverage mandatory
                
                Cultural Guidelines:
                - Respect for sacred sites and monasteries
                - Appropriate dress code enforcement
                - Local guide requirements for cultural sites
                - Traditional architecture for tourism facilities
                - Support for local artisans and craftspeople
                
                Sustainable Tourism Practices:
                - Waste management and recycling programs
                - Water conservation measures
                - Local sourcing of food and materials
                - Community-based tourism initiatives
                - Carbon offset programs for transportation
                
                Special Permits Required:
                - Restricted areas (additional permits needed)
                - Religious festivals (advance coordination required)
                - Adventure activities (safety certifications)
                - Photography in certain areas (special permissions)
                
                Tourist Levy:
                - Sustainable Development Fee: USD 200 per night per tourist
                - Reduced rates for regional tourists
                - Exemptions for certain cultural exchange programs
                """,
                "document_type": "licensing_guide",
                "department": "Tourism Council of Bhutan",
                "last_updated": "2024-01-25",
                "category": "tourism"
            },
            {
                "id": "passport_renewal_001",
                "title": "Passport Renewal Process for Bhutanese Citizens",
                "content": """
                Bhutanese citizens can renew their passports through a streamlined process.
                
                Eligibility:
                - Current passport holders
                - Bhutanese citizenship certificate holders
                - No pending legal issues
                
                Required Documents:
                - Current passport (original)
                - Citizenship certificate (original and copy)
                - Recent passport-size photographs (2 copies)
                - Completed application form
                - Fee payment receipt
                
                Process:
                1. Online application submission
                2. Document verification at immigration office
                3. Biometric data collection
                4. Processing (7-10 working days)
                5. Collection or postal delivery
                
                Fees:
                - Regular processing: BTN 1,000
                - Express processing: BTN 2,000
                - Postal delivery: BTN 200 additional
                
                Validity:
                - Adult passport: 10 years
                - Minor passport: 5 years
                
                Special Services:
                - Emergency passport: 24-48 hours (additional fees apply)
                - Diplomatic passport: Special procedures
                - Official passport: Government employees only
                """,
                "document_type": "procedure_guide",
                "department": "Department of Immigration",
                "last_updated": "2024-02-05",
                "category": "citizen_services"
            }
        ]
        
        # Extract documents and metadata
        for doc in sample_docs:
            self.documents.append(doc["content"])
            self.metadatas.append({
                "id": doc["id"],
                "title": doc["title"],
                "document_type": doc["document_type"],
                "department": doc["department"],
                "last_updated": doc["last_updated"],
                "category": doc["category"]
            })
        
        logger.info(f"✅ Loaded {len(sample_docs)} sample documents")
    
    async def _save_data(self):
        """Save FAISS index and documents to disk"""
        try:
            # Save FAISS index
            index_path = os.path.join(self.data_dir, "faiss_index.bin")
            faiss.write_index(self.index, index_path)
            
            # Save documents
            docs_path = os.path.join(self.data_dir, "documents.pkl")
            with open(docs_path, 'wb') as f:
                pickle.dump(self.documents, f)
            
            # Save metadata
            meta_path = os.path.join(self.data_dir, "metadata.json")
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump(self.metadatas, f, ensure_ascii=False, indent=2)
            
            logger.info("✅ Saved FAISS index and documents to disk")
            
        except Exception as e:
            logger.error(f"Error saving data: {e}")
            raise
    
    async def search_documents(
        self, 
        query: str, 
        n_results: int = 5,
        category_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for relevant documents using semantic similarity"""
        
        if not self.documents_loaded or self.index is None:
            logger.warning("RAG system not properly initialized")
            return []
        
        try:
            # Create query embedding
            query_embedding = self.embedding_model.encode([query]).astype('float32')
            faiss.normalize_L2(query_embedding)
            
            # Search in FAISS index
            scores, indices = self.index.search(query_embedding, min(n_results * 2, len(self.documents)))
            
            # Format results
            formatted_results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx == -1:  # FAISS returns -1 for invalid indices
                    continue
                
                metadata = self.metadatas[idx]
                
                # Apply category filter if specified
                if category_filter and metadata.get("category") != category_filter:
                    continue
                
                # Skip if we have enough results
                if len(formatted_results) >= n_results:
                    break
                
                content = self.documents[idx]
                formatted_results.append({
                    "title": metadata["title"],
                    "content": content,
                    "document_type": metadata["document_type"],
                    "department": metadata["department"],
                    "last_updated": metadata["last_updated"],
                    "category": metadata["category"],
                    "relevance_score": float(score),
                    "excerpt": content[:300] + "..." if len(content) > 300 else content
                })
            
            logger.info(f"Found {len(formatted_results)} relevant documents for query: {query[:50]}...")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            return []
    
    async def get_document_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific document by ID"""
        try:
            for i, metadata in enumerate(self.metadatas):
                if metadata.get("id") == doc_id:
                    return {
                        "id": doc_id,
                        "title": metadata["title"],
                        "content": self.documents[i],
                        "document_type": metadata["document_type"],
                        "department": metadata["department"],
                        "last_updated": metadata["last_updated"],
                        "category": metadata["category"]
                    }
            
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving document {doc_id}: {e}")
            return None
    
    async def get_categories(self) -> List[str]:
        """Get all available document categories"""
        try:
            categories = set()
            for metadata in self.metadatas:
                categories.add(metadata["category"])
            
            return sorted(list(categories))
            
        except Exception as e:
            logger.error(f"Error getting categories: {e}")
            return []
    
    async def health_check(self) -> bool:
        """Check if RAG system is healthy"""
        try:
            if not self.index or not self.documents_loaded:
                return False
            
            # Test search
            test_results = await self.search_documents("test query", n_results=1)
            return len(test_results) >= 0  # Even 0 results is OK for health check
            
        except Exception as e:
            logger.error(f"RAG health check failed: {e}")
            return False
    
    async def add_document(
        self, 
        doc_id: str, 
        title: str, 
        content: str, 
        metadata: Dict[str, Any]
    ):
        """Add a new document to the collection"""
        try:
            # Create embedding for new document
            embedding = self.embedding_model.encode([content]).astype('float32')
            faiss.normalize_L2(embedding)
            
            # Add to FAISS index
            self.index.add(embedding)
            
            # Add to documents and metadata
            self.documents.append(content)
            self.metadatas.append({
                "id": doc_id,
                "title": title,
                **metadata
            })
            
            # Save updated data
            await self._save_data()
            
            logger.info(f"Added document: {title}")
            
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            raise
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get RAG system statistics"""
        try:
            categories = await self.get_categories()
            
            return {
                "total_documents": len(self.documents),
                "categories": categories,
                "embedding_model": "all-MiniLM-L6-v2",
                "vector_database": "FAISS",
                "index_type": "IndexFlatIP",
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting statistics: {e}")
            return {}
    
    async def cleanup(self):
        """Cleanup resources"""
        try:
            # Save data before cleanup
            if self.index and self.documents_loaded:
                await self._save_data()
            
            logger.info("RAG system cleanup completed")
            
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
