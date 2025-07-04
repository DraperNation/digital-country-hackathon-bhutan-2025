import json
import os
from typing import Dict, List
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

load_dotenv("config.env")

from src.utils.logger import SingletonLogger

# Get the logger instance
logger_instance = SingletonLogger()
logger = logger_instance.get_logger()


class ChromaManager:
    def __init__(
        self, 
        host: str = None, 
        port: int = None, 
        collection_name: str = None,
        persist_directory: str = "./chroma_db"
    ):
        self.collection_name = collection_name or os.getenv("CHROMA_COLLECTION_NAME", "bhutan_document_embeddings")
        self.persist_directory = persist_directory
        
        # Check if host and port are provided or set in environment
        chroma_host = host or os.getenv("CHROMA_HOST")
        chroma_port = port or os.getenv("CHROMA_PORT")
        
        print(f"DEBUG: Initializing ChromaDB with persist_directory: {persist_directory}")
        print(f"DEBUG: Chroma host: {chroma_host}, port: {chroma_port}")
        logger.info(f"DEBUG: Initializing ChromaDB with persist_directory: {persist_directory}")
        
        # Initialize ChromaDB client
        if chroma_host and chroma_port:
            # Remote ChromaDB
            print(f"DEBUG: Using remote ChromaDB at {chroma_host}:{chroma_port}")
            self.client = chromadb.HttpClient(
                host=chroma_host,
                port=int(chroma_port)
            )
        else:
            # Local ChromaDB with persistence - explicitly use embedded mode
            print(f"DEBUG: Using local embedded ChromaDB at {persist_directory}")
            try:
                self.client = chromadb.PersistentClient(
                    path=persist_directory,
                    settings=Settings(
                        anonymized_telemetry=False,
                        is_persistent=True
                    )
                )
                print("DEBUG: ChromaDB client initialized successfully")
            except Exception as e:
                print(f"DEBUG: Error initializing ChromaDB client: {e}")
                logger.error(f"Error initializing ChromaDB client: {e}")
                raise

    def check_if_collection_exists(self) -> bool:
        try:
            collections = self.client.list_collections()
            collection_names = [col.name for col in collections]
            return self.collection_name in collection_names
        except Exception as e:
            logger.info(f"Collection {self.collection_name} does not exist. Creating now!")
            return False

    def create_collection(self):
        # Create a new collection
        self.collection = self.client.create_collection(
            name=self.collection_name,
            metadata={"description": "Bhutan Country Guide document embeddings"}
        )
        logger.info(f"Collection {self.collection_name} created")

    def get_collection(self):
        if not hasattr(self, 'collection'):
            if self.check_if_collection_exists():
                self.collection = self.client.get_collection(name=self.collection_name)
            else:
                self.create_collection()
        return self.collection

    def insert_vector(self, vector: List[float], payload: Dict):
        collection = self.get_collection()
        collection.add(
            embeddings=[vector],
            documents=[payload.get("text", "")],
            metadatas=[payload],
            ids=[payload.get("id", str(hash(str(payload))))]
        )

    def search_vectors(self, query_vector: List[float], limit: int = 5):
        collection = self.get_collection()
        results = collection.query(
            query_embeddings=[query_vector],
            n_results=limit
        )
        
        # Convert to the format expected by the application
        formatted_results = []
        if results['metadatas'] and results['metadatas'][0]:
            for i, metadata in enumerate(results['metadatas'][0]):
                formatted_results.append({
                    'payload': metadata,
                    'score': results['distances'][0][i] if results['distances'] else 0
                })
        
        return formatted_results

    def delete_collection(self):
        try:
            self.client.delete_collection(name=self.collection_name)
            logger.info(f"Collection {self.collection_name} deleted")
        except Exception as e:
            logger.error(f"Error deleting collection: {e}")

    def delete_points_by_key(self, key: str, value: str):
        collection = self.get_collection()
        try:
            # Get documents with the specified key-value pair
            results = collection.get(
                where={key: value}
            )
            
            if results['ids']:
                collection.delete(ids=results['ids'])
                logger.info(f"Deleted {len(results['ids'])} points with {key} '{value}'.")
            else:
                logger.info(f"No points found with {key} '{value}'.")
        except Exception as e:
            logger.error(f"Error deleting points: {e}")

    def get_distinct_key_values(self, key: str, limit: int = 1000) -> List[str]:
        """
        Fetch distinct key values from the specified ChromaDB collection.
        """
        collection = self.get_collection()
        try:
            # Get all documents to extract distinct values
            results = collection.get(limit=limit)
            distinct_values = set()
            
            for metadata in results['metadatas']:
                if metadata and key in metadata:
                    distinct_values.add(metadata[key])
            
            return list(distinct_values)
        except Exception as e:
            logger.error(f"Error getting distinct values: {e}")
            return []

    def __del__(self):
        # Optional: Clean up resources if needed
        pass 