import os
from typing import List

from src.dependencies import get_document_loader, get_chroma_manager
from src.DocumentProcessor import DocumentProcessor
from src.models import CreateVectorDBRequest, DeleteDocRequest
from src.utils.logger import SingletonLogger

logger_instance = SingletonLogger()
logger = logger_instance.get_logger()

RAW_PATH = os.getenv("RAW_DATA_PATH", "./data/raw")
PROCESSED_PATH = os.getenv("PROCESSED_DATA_PATH", "./data/processed")


def get_existing_documents() -> List[str]:
    chroma_manager = get_chroma_manager()
    existing_documents = chroma_manager.get_distinct_key_values(key="file_name")
    return existing_documents


def get_document_processor(model: str) -> DocumentProcessor:
    chroma_manager = get_chroma_manager()
    document_loader = get_document_loader()

    # Loading pdf documents
    pdf_paths = document_loader.load_pdf_files_path()
    logger.info(f"Loaded Documents: {pdf_paths}")

    # Creating ChromaDB Collection if not already exists:
    if not chroma_manager.check_if_collection_exists():
        logger.info(f"Creating New Collection {chroma_manager.collection_name}")
        chroma_manager.create_collection()
    else:
        logger.info(f"Collection {chroma_manager.collection_name} already exists")

    # Processing Documents to upload to Collection
    document_processor = DocumentProcessor(chroma_manager, model, pdf_paths)

    logger.info(f"DocumentProcessor created!")
    return document_processor


def delete_document(request: DeleteDocRequest):
    logger.info(f"Deleting Document {request.file_name}")
    document_processor = get_document_processor(request.model)
    try:
        document_processor.delete_documents(key="file_name", value=request.file_name)
        return {"response": f"{request.file_name} deleted from ChromaDB successfully!"}
    except Exception as e:
        logger.error(f"Failed to delete {request.file_name} and associated chunks: {str(e)}")
        return {"response": f"Failed to delete {request.file_name} and associated chunks\nError: {str(e)}"}


def populate_vector_db(request: CreateVectorDBRequest):
    try:
        logger.info("Starting Document Processing")

        # Get the file path from the request
        file_path = getattr(request, 'file_path', None)
        if not file_path:
            logger.error("No file_path provided in request")
            return {"success": False, "error": "No file_path provided"}

        # Verify file exists
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return {"success": False, "error": f"File not found: {file_path}"}

        # Get file name for processing
        file_name = os.path.basename(file_path)
        logger.info(f"Processing file: {file_name}")

        # Initialising DocumentProcessor
        document_processor = get_document_processor(request.model)

        if document_processor:
            logger.info(f"DocumentProcessor initialized: {document_processor}")
            
            # Process the specific file
            result = document_processor.process_single_document(file_path)
            
            if result.get("success"):
                logger.info("Processing Completed! Documents uploaded to Collection")
                
                # Get processing statistics
                chunks_created = result.get("chunks_created", 0)
                embeddings_created = result.get("embeddings_created", 0)
                
                # Move processed file
                if os.path.exists(RAW_PATH) and os.path.exists(PROCESSED_PATH):
                    import shutil
                    processed_file_path = os.path.join(PROCESSED_PATH, file_name)
                    if os.path.exists(file_path):
                        shutil.move(file_path, processed_file_path)
                        logger.info(f"Processed file moved to: {processed_file_path}")
                
                logger.info("Processed Documents moved to Processed Folder")
                return {
                    "success": True,
                    "response": f"ChromaDB updated successfully for {file_name}",
                    "chunks_created": chunks_created,
                    "embeddings_created": embeddings_created,
                    "file_name": file_name
                }
            else:
                logger.error(f"Document processing failed: {result.get('error')}")
                return {
                    "success": False,
                    "error": result.get("error", "Document processing failed")
                }
        else:
            logger.error("Failed to initialize DocumentProcessor.")
            return {"success": False, "error": "Failed to initialize DocumentProcessor."}

    except Exception as e:
        logger.error(f"ChromaDB Collection Creation Failed: {str(e)}")
        return {"success": False, "error": f"ChromaDB Collection Creation Failed!\nError: {str(e)}"} 