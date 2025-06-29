import os
import chainlit as cl
from src.services import query_service, document_service
from src.models import Message, QueryRequest, CreateVectorDBRequest, DeleteDocRequest, ChatHistory
from src.utils.logger import SingletonLogger
from translator.translate_bhutan import BhutanTranslator
import asyncio
import re

# Get the logger instance
logger_instance = SingletonLogger()
logger = logger_instance.get_logger()

# Constants
RAW_DATA_PATH = os.getenv("RAW_DATA_PATH", "./data/raw")
PROCESSED_DATA_PATH = os.getenv("PROCESSED_DATA_PATH", "./data/processed")

def upload_file_to_local(file):
    """Upload file to local data directory"""
    os.makedirs(RAW_DATA_PATH, exist_ok=True)
    file_path = os.path.join(RAW_DATA_PATH, file.name)
    with open(file_path, "wb") as f:
        f.write(file.content)
    return file.name, file_path

def delete_from_vector_db(file_name, model):
    """Delete document from vector database"""
    try:
        request = DeleteDocRequest(
            model=model,
            file_name=file_name
        )
        result = document_service.delete_document(request)
        return result.get("response", "Document deleted successfully")
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        return f"Error deleting document: {str(e)}"

def populate_vector_db(file_path, model):
    """Populate vector database with document"""
    try:
        request = CreateVectorDBRequest(
            model=model,
            file_path=file_path
        )
        result = document_service.populate_vector_db(request)
        return result
    except Exception as e:
        logger.error(f"Error populating vector DB: {e}")
        return {"success": False, "error": str(e)}

def list_existing_documents():
    """List existing documents in vector database"""
    try:
        documents = document_service.get_existing_documents()
        return documents
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        return []

@cl.on_chat_start
async def start():
    """Initialize the chat session"""
    await cl.Message(
        content="🏔️ **Tashi Delek! Welcome to your Bhutan Country Guide!**\n\n"
                "I'm here to help you explore the Land of the Thunder Dragon. "
                "Ask me about Bhutan's culture, travel destinations, visa requirements, "
                "or any other Bhutan-related topics!\n\n"
                "💡 **Tip**: Use the actions below to manage your Bhutan documents!",
        author="Bhutan Guide"
    ).send()
    
    # Add actions directly in the UI
    await cl.Action(
        name="upload_pdf",
        label="📄 Upload PDF",
        tooltip="Upload Bhutan-related PDF documents",
        payload={"action": "upload_pdf"}
    ).send(for_id="actions")
    
    await cl.Action(
        name="list_documents",
        label="📚 List Documents",
        tooltip="List uploaded documents",
        payload={"action": "list_documents"}
    ).send(for_id="actions")
    
    await cl.Action(
        name="show_stats",
        label="📊 Stats",
        tooltip="Show chat statistics",
        payload={"action": "show_stats"}
    ).send(for_id="actions")
    
    await cl.Action(
        name="clear_chat",
        label="🗑️ Clear Chat",
        tooltip="Clear chat history",
        payload={"action": "clear_chat"}
    ).send(for_id="actions")
    
    cl.user_session.set("chat_history", [])
    cl.user_session.set("selected_model", "Gemini")
    cl.user_session.set("documents_uploaded", [])

@cl.on_message
async def on_message(message: cl.Message):
    """Handle incoming chat messages"""
    try:
        print(f"DEBUG: Received message: {message.content}")
        logger.info(f"DEBUG: Received message: {message.content}")
        
        chat_history = cl.user_session.get("chat_history", [])
        selected_model = cl.user_session.get("selected_model", "Gemini")
        
        print(f"DEBUG: Chat history length: {len(chat_history)}")
        print(f"DEBUG: Selected model: {selected_model}")
        
        # Show loading message with animation
        loading_msg = cl.Message(
            content="🔄 **Searching my knowledge base and the web for Bhutan information...** ⏳",
            author="Bhutan Guide"
        )
        await loading_msg.send()
        
        # Create query request
        req = QueryRequest(
            question=message.content, 
            chat_history=chat_history, 
            model=selected_model
        )
        
        print(f"DEBUG: Created QueryRequest: {req}")
        
        # Get response from service directly (no API call)
        print("DEBUG: Calling query_service.get_response...")
        
        # Add timeout to prevent hanging
        try:
            print("DEBUG: Starting LLM request...")
            response = await asyncio.wait_for(
                asyncio.to_thread(query_service.get_response, req),
                timeout=60.0  # Increased to 60 seconds
            )
            print("DEBUG: LLM request completed successfully")
        except asyncio.TimeoutError:
            print("DEBUG: LLM request timed out after 60 seconds")
            await loading_msg.remove()
            await cl.Message(
                content="⏰ Response is taking longer than expected. Please try again later.",
                author="Bhutan Guide"
            ).send()
            return
        except Exception as e:
            print(f"DEBUG: Error in LLM request: {e}")
            await loading_msg.remove()
            await cl.Message(
                content="😔 Please try again later. Server busy.",
                author="Bhutan Guide"
            ).send()
            return
        
        print(f"DEBUG: Response type: {type(response)}")
        print(f"DEBUG: Response: {response}")
        
        # Extract content from response - response is an AIMessage object
        if hasattr(response, "content"):
            content = response.content
            print(f"DEBUG: Using response.content: {content}")
        elif hasattr(response, "text"):
            content = response.text
            print(f"DEBUG: Using response.text: {content}")
        else:
            content = str(response)
            print(f"DEBUG: Using str(response): {content}")
        
        # Clean up markdown syntax that might not render properly in Chainlit
        # Replace :red[...] with **...** for better visibility
        if ":red[" in content:
            content = content.replace(":red[", "**").replace("]", "**")
            print(f"DEBUG: Cleaned up red markdown syntax")
        
        # Replace other markdown syntax that might not work in Chainlit
        content = content.replace(":blue[", "**").replace(":green[", "**").replace(":yellow[", "**")
        content = BhutanTranslator().translate_english_to_dzongkha(content)
        print(f"DEBUG: Final content to send: {content}")
        
        # Remove the loading message
        await loading_msg.remove()
        
        # Send the complete response as a single message to preserve formatting
        await cl.Message(
            content=content,
            author="Bhutan Guide"
        ).send()
        
        print("DEBUG: Response sent successfully")
        
        # Update chat history
        chat_history.append(Message(role="human", content=message.content))
        chat_history.append(Message(role="ai", content=content))
        cl.user_session.set("chat_history", chat_history)
        
        print("DEBUG: Chat history updated")
        
    except Exception as e:
        print(f"DEBUG: Exception occurred: {e}")
        logger.error(f"Error processing message: {e}")
        
        # Remove loading message if it exists
        try:
            await loading_msg.remove()
        except:
            pass
        
        # Send error message
        await cl.Message(
            content="😔 Please try again later. Server busy.",
            author="Bhutan Guide"
        ).send()

@cl.on_settings_update
async def on_settings_update(settings):
    """Handle settings updates (LLM model selection)"""
    if "llm_model" in settings:
        cl.user_session.set("selected_model", settings["llm_model"])
        await cl.Message(
            content=f"✅ LLM model updated to: {settings['llm_model']}"
        ).send()

@cl.action_callback("upload_pdf")
async def upload_pdf(action):
    """Handle PDF upload with comprehensive file management"""
    try:
        # Get current model
        selected_model = cl.user_session.get("selected_model", "Gemini")
        
        # Get existing documents
        existing_files = list_existing_documents()
        
        # Create file upload message
        files = await cl.AskFileMessage(
            content="📄 **Upload Bhutan-related PDF documents**\n\n"
                    "✨ **What I'll do with your documents:**\n"
                    "• 📖 Extract text and create intelligent chunks\n"
                    "• 🧠 Generate embeddings for semantic search\n"
                    "• 💾 Store in ChromaDB for instant retrieval\n"
                    "• 🔍 Use for answering your Bhutan questions\n\n"
                    f"📚 **Existing documents:** {len(existing_files)} files\n"
                    "**Please select PDF files about Bhutan** (max 10MB each, up to 5 files)",
            accept=["application/pdf"],
            max_size_mb=10,
            max_files=5
        ).send()
        
        if files:
            uploaded_files = cl.user_session.get("documents_uploaded", [])
            
            for file in files:
                file_name, file_path = upload_file_to_local(file)
                
                # Check if file already exists
                if file_name in existing_files:
                    await cl.Message(
                        content=f"🔄 **File already exists**: {file_name}\n\n"
                                f"Deleting old version and uploading new one...",
                        author="Bhutan Guide"
                    ).send()
                    
                    # Delete existing file
                    delete_result = delete_from_vector_db(file_name, selected_model)
                    await cl.Message(
                        content=f"🗑️ **Deleted old version**: {file_name}\n\n{delete_result}",
                        author="Bhutan Guide"
                    ).send()
                
                # Upload new file
                await cl.Message(
                    content=f"📤 **Uploading**: {file_name} to VectorDB...",
                    author="Bhutan Guide"
                ).send()
                
                result = populate_vector_db(file_path, selected_model)
                
                if result.get("success"):
                    uploaded_files.append(file_name)
                    await cl.Message(
                        content=f"✅ **Successfully processed**: {file_name}\n\n"
                                f"📊 **Processing Details**:\n"
                                f"• 📄 File size: {len(file.content) / 1024:.1f} KB\n"
                                f"• 🔪 Chunks created: {result.get('chunks_created', 'N/A')}\n"
                                f"• 🧠 Embeddings generated: {result.get('embeddings_created', 'N/A')}\n"
                                f"• 💾 Stored in ChromaDB: ✅\n"
                                f"• 🔍 Ready for semantic search: ✅\n\n"
                                f"💡 The document has been processed and added to my Bhutan knowledge base!",
                        author="Bhutan Guide"
                    ).send()
                else:
                    await cl.Message(
                        content=f"❌ **Processing failed**: {file_name}\n\n"
                                f"Error: {result.get('error', 'Unknown error')}",
                        author="Bhutan Guide"
                    ).send()
            
            cl.user_session.set("documents_uploaded", uploaded_files)
            
            # Show final summary
            final_count = len(list_existing_documents())
            await cl.Message(
                content=f"📚 **Upload Complete!**\n\n"
                        f"Total documents in knowledge base: {final_count}\n"
                        f"Ready to answer your Bhutan questions! 🏔️",
                author="Bhutan Guide"
            ).send()
        else:
            await cl.Message(
                content="📄 No files selected. You can try uploading again anytime using the 📄 Upload PDF action!",
                author="Bhutan Guide"
            ).send()
    except Exception as e:
        logger.error(f"Error uploading PDF: {e}")
        await cl.Message(
            content=f"❌ Error uploading PDF: {str(e)}",
            author="Bhutan Guide"
        ).send()

@cl.action_callback("list_documents")
async def list_documents(action):
    """List uploaded documents with detailed information"""
    try:
        documents = list_existing_documents()
        if documents:
            doc_list = "\n".join([f"• {doc}" for doc in documents])
            await cl.Message(
                content=f"📚 **Documents in Knowledge Base** ({len(documents)} total):\n\n{doc_list}\n\n"
                        f"💡 These documents are ready to answer your Bhutan questions!",
                author="Bhutan Guide"
            ).send()
        else:
            await cl.Message(
                content="📚 No documents uploaded yet. Please upload some Bhutan documents first using the 📄 Upload PDF action!",
                author="Bhutan Guide"
            ).send()
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        await cl.Message(
            content=f"❌ Error listing documents: {str(e)}",
            author="Bhutan Guide"
        ).send()

@cl.action_callback("delete_document")
async def delete_document(action):
    """Delete specific documents from the knowledge base"""
    try:
        documents = list_existing_documents()
        selected_model = cl.user_session.get("selected_model", "Gemini")
        
        if not documents:
            await cl.Message(
                content="📚 No documents available to delete.",
                author="Bhutan Guide"
            ).send()
            return
        
        # Create a message with document selection
        doc_list = "\n".join([f"{i+1}. {doc}" for i, doc in enumerate(documents)])
        
        await cl.Message(
            content=f"🗑️ **Select document to delete:**\n\n{doc_list}\n\n"
                    f"Reply with the number of the document you want to delete.",
            author="Bhutan Guide"
        ).send()
        
        # Store documents for deletion
        cl.user_session.set("documents_for_deletion", documents)
        
    except Exception as e:
        logger.error(f"Error preparing document deletion: {e}")
        await cl.Message(
            content=f"❌ Error preparing document deletion: {str(e)}",
            author="Bhutan Guide"
        ).send()

@cl.action_callback("process_document_deletion")
async def process_document_deletion(action):
    """Process the actual document deletion"""
    try:
        documents = cl.user_session.get("documents_for_deletion", [])
        selected_model = cl.user_session.get("selected_model", "Gemini")
        
        # Parse the user's selection (assuming they replied with a number)
        user_input = action.value if hasattr(action, 'value') else ""
        
        try:
            doc_index = int(user_input) - 1
            if 0 <= doc_index < len(documents):
                doc_name = documents[doc_index]
                
                # Delete the document
                result = delete_from_vector_db(doc_name, selected_model)
                
                await cl.Message(
                    content=f"✅ **Successfully deleted**: {doc_name}\n\n{result}",
                    author="Bhutan Guide"
                ).send()
                
                # Clear the deletion list
                cl.user_session.set("documents_for_deletion", [])
                
                # Show updated count
                remaining_count = len(list_existing_documents())
                await cl.Message(
                    content=f"📚 **Updated**: {remaining_count} documents remaining in knowledge base.",
                    author="Bhutan Guide"
                ).send()
            else:
                await cl.Message(
                    content="❌ Invalid document number. Please try again.",
                    author="Bhutan Guide"
                ).send()
        except ValueError:
            await cl.Message(
                content="❌ Please provide a valid number for document selection.",
                author="Bhutan Guide"
            ).send()
            
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        await cl.Message(
            content=f"❌ Error deleting document: {str(e)}",
            author="Bhutan Guide"
        ).send()

@cl.action_callback("clear_chat")
async def clear_chat(action):
    """Clear chat history"""
    cl.user_session.set("chat_history", [])
    await cl.Message(
        content="🗑️ Chat history cleared! Start a new conversation.",
        author="Bhutan Guide"
    ).send()

@cl.action_callback("show_stats")
async def show_stats(action):
    """Show comprehensive chat and document statistics"""
    try:
        chat_history = cl.user_session.get("chat_history", [])
        documents = list_existing_documents()
        selected_model = cl.user_session.get("selected_model", "Gemini")
        
        stats = f"""
📊 **Bhutan Guide Statistics:**

💬 **Chat Activity:**
• Messages: {len(chat_history)}
• Model: {selected_model}

📚 **Knowledge Base:**
• Documents: {len(documents)}
• Files: {', '.join(documents) if documents else 'None'}

💾 **Storage:**
• Raw data: {RAW_DATA_PATH}
• Processed data: {PROCESSED_DATA_PATH}

🏔️ **Ready to help with Bhutan questions!**
"""
        
        await cl.Message(content=stats, author="Bhutan Guide").send()
    except Exception as e:
        logger.error(f"Error showing stats: {e}")
        await cl.Message(
            content=f"❌ Error showing statistics: {str(e)}",
            author="Bhutan Guide"
        ).send()

@cl.action_callback("summarize_chat")
async def summarize_chat(action):
    """Summarize current chat history"""
    try:
        chat_history = cl.user_session.get("chat_history", [])
        if chat_history:
            # Create ChatHistory object for service
            chat_history_obj = ChatHistory(chat_history=chat_history)
            
            # Call service directly instead of API
            summary = query_service.summarize_text(chat_history_obj)
            
            await cl.Message(
                content=f"📝 **Chat Summary:**\n\n{summary}",
                author="Bhutan Guide"
            ).send()
        else:
            await cl.Message(
                content="💬 No chat history to summarize. Start a conversation first!",
                author="Bhutan Guide"
            ).send()
    except Exception as e:
        logger.error(f"Error summarizing chat: {e}")
        await cl.Message(
            content=f"❌ Error summarizing chat: {str(e)}",
            author="Bhutan Guide"
        ).send() 