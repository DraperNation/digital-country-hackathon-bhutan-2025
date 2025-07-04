import os
import uuid
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader

from src.LLMHandler.LLMFactory import LLMFactory
from src.ChromaManager import ChromaManager
from src.utils.logger import SingletonLogger

# Get the logger instance
logger_instance = SingletonLogger()
logger = logger_instance.get_logger()


class DocumentProcessor:
    def __init__(self, chroma_manager: ChromaManager, model: str, pdf_paths: List[str]):
        """
        Initializes the DocumentProcessor with ChromaDB manager and a list of local PDF paths.

        Args:
            chroma_manager (ChromaManager): The manager to handle ChromaDB operations.
            pdf_paths (List[str]): A list of file paths for the local PDF documents.
        """
        try:
            logger.info(f"Initializing Document processor")
            self.chroma_manager = chroma_manager
            self.pdf_paths = pdf_paths

            # Initialize text splitter
            self.text_splitter = RecursiveCharacterTextSplitter(
                separators=["\n\n", "\n", " ", ""], chunk_size=100, chunk_overlap=10
            )

            # Initialize LLM
            self.model = model
            llm_factory = LLMFactory()
            llm_handler = llm_factory.create_llm(llm_type=self.model)
            self.embed_llm = llm_handler.get_embed_llm()
            logger.info(f"Document processor initialized successfully")
        except Exception as e:
            logger.error(f"Error while initializing Document processor: {e}")

    def get_document_paths(self) -> List[str]:
        return self.pdf_paths

    def get_model(self) -> str:
        return self.model

    def process_single_document(self, pdf_path: str) -> dict:
        """
        Processes a single PDF document, splits the text, creates embeddings,
        and stores them in ChromaDB. Returns statistics about the processing.

        Args:
            pdf_path (str): Path to the PDF file to process

        Returns:
            dict: Processing statistics including success status, chunks created, and embeddings generated
        """
        try:
            file_name = os.path.basename(pdf_path)
            logger.info(f"Processing single document: {file_name}")

            # Load the PDF document
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()

            total_chunks = 0
            total_embeddings = 0

            # Process each document
            for doc_index, doc in enumerate(documents):
                logger.info(f"Processing document {doc_index + 1} in {pdf_path}")

                # Split text into chunks
                text_chunks = self.text_splitter.split_text(doc.page_content)
                total_chunks += len(text_chunks)

                # Generate and store embeddings
                for chunk_index, chunk in enumerate(text_chunks):
                    logger.info(f"Processing chunk {chunk_index + 1}")

                    # Generate embedding
                    embedding = self.embed_llm.embed_query(chunk)
                    total_embeddings += 1

                    # Create a unique identifier for each chunk
                    chunk_id = str(uuid.uuid4())
                    chunk_name = f"{file_name}_doc{doc_index + 1}_chunk{chunk_index + 1}"

                    # Prepare payload
                    payload = {
                        "id": chunk_id,
                        "chunk_name": chunk_name,
                        "file_name": file_name,
                        "file_path": pdf_path,
                        "chunk_index": chunk_index + 1,
                        "chunk_size": len(chunk),
                        "text": chunk,
                    }

                    # Insert into ChromaDB
                    self.chroma_manager.insert_vector(embedding, payload)

            logger.info(f"Successfully processed {file_name}: {total_chunks} chunks, {total_embeddings} embeddings")
            return {
                "success": True,
                "chunks_created": total_chunks,
                "embeddings_created": total_embeddings,
                "file_name": file_name
            }

        except Exception as e:
            logger.error(f"Error while processing single document: {e}")
            return {
                "success": False,
                "error": str(e),
                "chunks_created": 0,
                "embeddings_created": 0
            }

    def process_documents(self, pdf_path: str):
        """
        Processes each PDF document, splits the text, creates embeddings,
        and stores them in ChromaDB.
        """

        try:
            file_name = os.path.basename(pdf_path)
            logger.info(f"Processing: {file_name}")

            # Load the PDF document
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()

            # Process each document
            for doc_index, doc in enumerate(documents):
                logger.info(f"Processing document {doc_index + 1} in {pdf_path}")

                # Split text into chunks
                text_chunks = self.text_splitter.split_text(doc.page_content)

                # Generate and store embeddings
                for chunk_index, chunk in enumerate(text_chunks):
                    logger.info(f"Processing chunk {chunk_index + 1}")

                    # Generate embedding
                    embedding = self.embed_llm.embed_query(chunk)

                    # Create a unique identifier for each chunk
                    chunk_id = str(uuid.uuid4())
                    chunk_name = f"{file_name}_doc{doc_index + 1}_chunk{chunk_index + 1}"

                    # Prepare payload
                    payload = {
                        "id": chunk_id,
                        "chunk_name": chunk_name,
                        "file_name": file_name,
                        "file_path": pdf_path,
                        "chunk_index": chunk_index + 1,
                        "chunk_size": len(chunk),
                        "text": chunk,
                    }

                    # Insert into ChromaDB
                    self.chroma_manager.insert_vector(embedding, payload)

        except Exception as e:
            logger.error(f"Error while processing document: {e}")

    def delete_documents(self, key: str, value: str):
        try:
            # Delete chunks from ChromaDB
            chroma_manager = self.chroma_manager
            chroma_manager.delete_points_by_key(key=key, value=value)
            logger.info(f"Deleted documents with {key}: {value} from ChromaDB")
        except Exception as e:
            logger.error(f"Failed to delete document and associated chunks: {str(e)}") 