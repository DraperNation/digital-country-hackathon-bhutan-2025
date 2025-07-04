import os
from src.ChromaManager import ChromaManager
from src.DocumentLoader import DocumentLoader
from src.utils.logger import SingletonLogger
from dotenv import load_dotenv

load_dotenv("config.env")

logger_instance = SingletonLogger()
logger = logger_instance.get_logger()

RAW_PATH = os.getenv("RAW_DATA_PATH", "./data/raw")


def get_chroma_manager() -> ChromaManager:
    host = os.getenv("CHROMA_HOST")
    port = int(os.getenv("CHROMA_PORT", "8000"))
    collection_name = os.getenv("CHROMA_COLLECTION_NAME", "ebutan_document_embeddings")
    
    chroma_manager = ChromaManager(
        host=host,
        port=port,
        collection_name=collection_name
    )
    
    # Creating ChromaDB Collection if not already exists:
    if not chroma_manager.check_if_collection_exists():
        logger.info(f"Creating New Collection {chroma_manager.collection_name}")
        chroma_manager.create_collection()
    else:
        logger.info(f"Collection {chroma_manager.collection_name} already exists")
    return chroma_manager


def get_document_loader() -> DocumentLoader:
    return DocumentLoader(RAW_PATH) 