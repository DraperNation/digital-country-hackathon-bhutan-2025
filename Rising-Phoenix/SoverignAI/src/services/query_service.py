from src.dependencies import get_chroma_manager
from src.models import ChatHistory, QueryRequest
from src.QueryHandler import QueryHandler
from src.utils.logger import SingletonLogger

logger_instance = SingletonLogger()
logger = logger_instance.get_logger()


def get_response(request: QueryRequest):
    print(f"DEBUG: query_service.get_response called with: {request}")
    logger.info(f"DEBUG: query_service.get_response called with: {request}")
    
    chroma_manager = get_chroma_manager()
    print(f"DEBUG: Got chroma_manager: {chroma_manager}")
    
    query_handler = QueryHandler(chroma_manager=chroma_manager, model=request.model)
    print(f"DEBUG: Created QueryHandler: {query_handler}")
    
    print(f"DEBUG: Calling generate_response with question: {request.question}")
    response = query_handler.generate_response(request.question, request.chat_history)
    
    print(f"DEBUG: generate_response returned: {response}")
    print(f"DEBUG: Response type: {type(response)}")
    
    return response


def summarize_text(chat_history: ChatHistory):
    # Simple text summarization for now
    # In a real implementation, you might want to use the LLM for summarization
    messages = [f"{msg.role}: {msg.content}" for msg in chat_history.chat_history]
    summary = " ".join(messages[-5:])  # Last 5 messages as summary
    return summary 