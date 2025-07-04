import logging
from typing import Any, Dict, List

from langchain.memory import ConversationSummaryBufferMemory

from src.LLMHandler.LLMFactory import LLMFactory
from src.models import Message
from src.Prompts.PromptBuilder import PromptBuilder
from src.ChromaManager import ChromaManager
from src.utils.web_search import web_search_utility


class QueryHandler:
    def __init__(self, chroma_manager: ChromaManager, model: str, memory_limit: int = 5):
        """
        Initializes the QueryHandler with ChromaDB manager, Gemini model, and memory limit.

        Args:
            chroma_manager (ChromaManager): The manager to handle ChromaDB operations.
            model (str): The LLM model to use.
            memory_limit (int): The number of previous interactions to remember.
        """
        self.chroma_manager = chroma_manager
        self.memory_limit = memory_limit
        self.prompt_builder = PromptBuilder()

        # Initialize LLMs
        self.model = model
        llm_factory = LLMFactory()
        llm_handler = llm_factory.create_llm(llm_type=self.model)
        self.query_llm = llm_handler.get_query_llm()
        self.embed_llm = llm_handler.get_embed_llm()

        # Initialize the conversation memory
        self.memory = ConversationSummaryBufferMemory(max_token_limit=memory_limit, llm=self.query_llm)

    def _should_use_web_search(self, question: str, retrieved_text: str) -> bool:
        """
        Determine if web search should be used based on question and retrieved content.
        
        Args:
            question (str): The user's question
            retrieved_text (str): Text retrieved from local documents
            
        Returns:
            bool: True if web search should be used
        """
        # Check if the question is about Bhutan
        bhutan_keywords = ['bhutan', 'bhutanese', 'thimphu', 'paro', 'punakha', 'bumthang', 
                          'dzongkha', 'tashi delek', 'gnh', 'gross national happiness']
        
        question_lower = question.lower()
        is_bhutan_question = any(keyword in question_lower for keyword in bhutan_keywords)
        
        # If it's a Bhutan question but we have little or no relevant local content
        if is_bhutan_question and (not retrieved_text or len(retrieved_text.strip()) < 100):
            return True
            
        return False

    def _get_web_information(self, question: str) -> tuple[str, list[str]]:
        """
        Get relevant information from the web for Bhutan-related questions.
        
        Args:
            question (str): The user's question
            
        Returns:
            tuple[str, list[str]]: Web-sourced information and list of URLs
        """
        try:
            # Extract key topics from the question
            question_lower = question.lower()
            
            # Get web search results
            web_results = web_search_utility.search_bhutan_info(question, max_results=3)
            
            if not web_results:
                return "", []
            
            # Extract information and URLs
            web_info_parts = []
            urls = []
            
            for result in web_results:
                if result.get('snippet'):
                    web_info_parts.append(f"• {result['snippet']}")
                if result.get('url') and result['url'] not in urls:
                    urls.append(result['url'])
            
            web_info = "\n".join(web_info_parts)
            
            if web_info:
                return f"\n\n🌐 **Additional Information from Web Sources:**\n{web_info}\n\n*Note: This information is sourced from reliable web sources to supplement our knowledge base.*", urls
            
            return "", urls
            
        except Exception as e:
            logging.error(f"Error getting web information: {e}")
            return "", []

    def generate_response(self, question: str, chat_history: List[Message]) -> Dict[str, Any]:
        """
        Generates a response to the user's question by querying the vector store and using the LLM.

        Args:
            question (str): The user's question.
            chat_history (str): The user's chat context and summarised chat history.'

        Returns:
            Dict[str, Any]: The generated response.
        """
        logging.info(f"Processing question: {question}")

        # Generate the embedding for the query
        query_embedding = self.embed_llm.embed_query(question)

        # Search the vector store for relevant vectors
        search_results = self.chroma_manager.search_vectors(query_embedding)
        
        # Extract relevant texts from the search results
        retrieved_texts = [result['payload']["text"] for result in search_results]

        # Combine the relevant texts into a context for the LLM
        retrieved_text = "\n".join(retrieved_texts)
        
        # Check if we should supplement with web search
        web_information = ""
        urls = []
        if self._should_use_web_search(question, retrieved_text):
            web_information, urls = self._get_web_information(question)
        
        # Prepare the Prompt for the LLM
        combined_prompt = self.prompt_builder.get_combined_prompt(question)
        prompt = f"Question: {combined_prompt}\n\nChat History:\n{chat_history}\n\nRetrieved Relevant Text:{retrieved_text}{web_information}\n\nAnswer:"
        logging.info(f"Generated prompt: {prompt}")

        # Generate the response using Query LLM
        chat_reply = self.query_llm.invoke(input=prompt)

        llm_response = chat_reply

        logging.info(f"{type(llm_response)}")

        logging.info(f"Generated response: {llm_response}")
        if question.lower() not in ["hi","hello","thank","ok"]:
            # Only add "For your Reference" if there are web sources
            if urls:
                res='\n\n\n:red[For your Reference] \n\n'
                lst = [result['payload'] for result in search_results]
                files={x['file_name']: [str(d['chunk_index']) for d in lst if d['file_name'] == x['file_name']] for x in lst}
                for key,value in files.items():
                    res+=f':green[{key}] - {",".join(value)}\n\n'
                
                # Add web source information
                res += '\n🌐 **Web Sources Used:**\n'
                for url in urls:
                    res += f"• {url}\n"
                res += '\n'
                
                llm_response.content+=res
        return llm_response 