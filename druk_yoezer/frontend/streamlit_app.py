"""
Druk Yoezer - Streamlit Frontend
Professional interface for the AI-powered digital civil Assistant
"""

import streamlit as st
import requests
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import time

# Page configuration
st.set_page_config(
    page_title="Druk Yoezer - Your Digital Civil Assistant",
    page_icon="🇧🇹",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Bhutanese styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
    }
    
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #FF6B35;
    }
    
    .user-message {
        background-color: #f0f2f6;
        border-left-color: #FF6B35;
    }
    
    .bot-message {
        background-color: #e8f4fd;
        border-left-color: #F7931E;
    }
    
    .gnh-badge {
        background: linear-gradient(45deg, #FF6B35, #F7931E);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .confidence-high { color: #28a745; font-weight: bold; }
    .confidence-medium { color: #ffc107; font-weight: bold; }
    .confidence-low { color: #dc3545; font-weight: bold; }
    
    .sidebar-section {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Configuration
API_BASE_URL = "http://localhost:8000"

class GovBotInterface:
    """Main interface class for Druk Yoezer"""
    
    def __init__(self):
        self.initialize_session_state()
    
    def initialize_session_state(self):
        """Initialize session state variables"""
        if 'messages' not in st.session_state:
            st.session_state.messages = []
        
        if 'session_id' not in st.session_state:
            st.session_state.session_id = None
        
        if 'user_profile' not in st.session_state:
            st.session_state.user_profile = {}
        
        if 'conversation_history' not in st.session_state:
            st.session_state.conversation_history = []
    
        if 'message_counter' not in st.session_state:
            st.session_state.message_counter = 0
    
    def render_header(self):
        """Render the main header"""
        st.markdown("""
        <div class="main-header">
            <h1>Druk Yoezer</h1>
            <h3>Your AI-Powered Bhutanese Digital Civil Assistant</h3>
            <p>Guided by Gross National Happiness • Serving the Kingdom of Bhutan</p>
        </div>
        """, unsafe_allow_html=True)
    
    def render_sidebar(self):
        """Render the sidebar with user profile and options"""
        with st.sidebar:
            st.markdown("### 👤 User Profile")
            
            # User type selection
            user_type = st.selectbox(
                "I am a:",
                ["citizen", "foreign_entrepreneur", "local_business", "government_official", "tourist"],  # Updated order
                format_func=lambda x: {
                    "citizen": "🏠 Bhutanese Citizen",  # Changed key
                    "foreign_entrepreneur": "🌍 Foreign Entrepreneur", 
                    "local_business": "🏢 Local Business Owner",
                    "government_official": "🏛️ Government Official",
                    "tourist": "✈️ Tourist/Visitor"
                }[x]
            )
            
            # Business sector (if applicable)
            business_sector = None
            if user_type in ["foreign_entrepreneur", "local_business"]:
                business_sector = st.selectbox(
                    "Business Sector:",
                    ["technology", "tourism", "agriculture", "manufacturing", "services", "education", "healthcare"],
                    format_func=lambda x: x.title()
                )
            
            # Location
            location = st.selectbox(
                "Location:",
                ["Thimphu", "Paro", "Punakha", "Wangdue", "Bumthang", "Trongsa", 
                 "Mongar", "Trashigang", "Samdrup Jongkhar", "Other"]
            )
            
            # Language preference
            language_preference = st.selectbox(
                "Language Preference:",
                ["english", "dzongkha"],
                format_func=lambda x: {"english": "🇬🇧 English", "dzongkha": "🇧🇹 Dzongkha"}[x]
            )
            
            # Experience level
            experience_level = st.selectbox(
                "Experience Level:",
                ["beginner", "intermediate", "expert"],
                format_func=lambda x: x.title()
            )
            
            # Update session state
            st.session_state.user_profile = {
                "user_type": user_type,
                "business_sector": business_sector,
                "location": location,
                "language_preference": language_preference,
                "experience_level": experience_level
            }
            
            st.markdown("---")
            
            # Quick actions
            st.markdown("### ⚡ Quick Actions")
            
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("📋 Sample Questions", use_container_width=True):
                    self.show_sample_questions()
            
            with col2:
                if st.button("🔄 Clear Chat", use_container_width=True):
                    st.session_state.messages = []
                    st.session_state.conversation_history = []
                    st.rerun()
            
            # System status
            st.markdown("---")
            st.markdown("### 📊 System Status")
            
            try:
                health_response = requests.get(f"{API_BASE_URL}/api/health", timeout=5)
                if health_response.status_code == 200:
                    health_data = health_response.json()
                    status = health_data.get("status", "unknown")
                    
                    if status == "healthy":
                        st.success("🟢 System Online")
                    else:
                        st.warning("🟡 System Degraded")
                else:
                    st.error("🔴 System Offline")
            except:
                st.error("🔴 Cannot Connect")
            
            # GNH principles
            st.markdown("---")
            st.markdown("### 🌸 GNH Principles")
            st.markdown("""
            <div class="sidebar-section">
                <small>
                • Sustainable Development<br>
                • Environmental Conservation<br>
                • Cultural Preservation<br>
                • Good Governance
                </small>
            </div>
            """, unsafe_allow_html=True)
    
    def show_sample_questions(self):
        """Show sample questions in a modal"""
        with st.expander("📋 Sample Questions by User Type", expanded=True):
            user_type = st.session_state.user_profile.get("user_type", "citizen")
            
            if user_type == "foreign_entrepreneur":
                questions = [
                    "How do I register a tech company in Bhutan as a foreign entrepreneur?",
                    "What are the eResidency requirements and benefits?",
                    "What are the tax implications for a digital nomad doing business in Bhutan?",
                    "How can I get GNH certification for my business?",
                    "What is the minimum investment required for foreign businesses?"
                ]
            elif user_type == "local_business":
                questions = [
                    "How does Gross National Happiness philosophy apply to business practices?",
                    "What permits do I need for a tourism business in Thimphu?",
                    "How can I get government funding for a sustainable agriculture project?",
                    "What are the tax benefits for GNH certified businesses?",
                    "How do I register for GST in Bhutan?"
                ]
            elif user_type == "tourist":
                questions = [
                    "What cultural etiquette should I follow when visiting dzongs?",
                    "How do I respect local customs during my visit?",
                    "What are the photography restrictions in Bhutan?",
                    "How can I participate in local festivals respectfully?",
                    "What should I know about Bhutanese dining customs?"
                ]
            else:  # citizen or government_official
                questions = [
                    "How do I apply for a passport renewal?",
                    "What are the requirements for building a house in rural areas?",
                    "How can I register for social security benefits?",
                    "What documents do I need for marriage registration?",
                    "How do I apply for a driving license?"
                ]
            
            for i, question in enumerate(questions, 1):
                # Create truly unique key using timestamp and counter
                unique_key = f"sample_q_{user_type}_{i}_{int(time.time() * 1000)}"
                if st.button(f"{i}. {question}", key=unique_key, use_container_width=True):
                    st.session_state.messages.append({"role": "user", "content": question})
                    self.process_query(question)
                    st.rerun()
    
    def render_chat_interface(self):
        """Render the main chat interface"""
        # Chat container
        chat_container = st.container()
        
        with chat_container:
            # Display conversation history
            for message in st.session_state.messages:
                self.render_message(message)
        
        # Input area
        st.markdown("---")
        
        # Query input
        col1, col2 = st.columns([4, 1])
        
        with col1:
            if "current_input" not in st.session_state:
                st.session_state.current_input = ""
            
            user_input = st.text_area(
                "Ask me anything about government services in Bhutan:",
                placeholder="e.g., How do I register a business in Bhutan?",
                height=100,
                value=st.session_state.current_input
            )
        
        with col2:
            st.markdown("<br>", unsafe_allow_html=True)  # Spacing
            
            send_button = st.button("Send 📤", use_container_width=True, type="primary")
            
            include_traces = st.checkbox("Include AI reasoning", value=False)
        
        # Process input
        if send_button and user_input.strip():
            # Add user message
            st.session_state.messages.append({"role": "user", "content": user_input})
            
            # Process query
            self.process_query(user_input, include_traces)
            
            # Clear input
            st.session_state.current_input = ""
            st.rerun()
    
    def render_message(self, message: Dict[str, Any]):
        """Render a single message"""
        if message["role"] == "user":
            st.markdown(f"""
            <div class="chat-message user-message">
                <strong>👤 You:</strong><br>
                {message["content"]}
            </div>
            """, unsafe_allow_html=True)
        
        else:  # assistant
            # Main response
            st.markdown(f"""
            <div class="chat-message bot-message">
                <strong>🇧🇹 GovBot:</strong><br>
                {message["content"]}
            </div>
            """, unsafe_allow_html=True)
            
            # Additional information if available
            if "metadata" in message:
                metadata = message["metadata"]
                
                # Confidence score
                if "confidence_score" in metadata:
                    confidence = metadata["confidence_score"]
                    confidence_class = self.get_confidence_class(confidence)
                    
                    st.markdown(f"""
                    <div style="margin-left: 1rem; margin-bottom: 1rem;">
                        <small>Confidence: <span class="{confidence_class}">{confidence:.1%}</span></small>
                    </div>
                    """, unsafe_allow_html=True)
                
                # Agents used
                if "agents_used" in metadata:
                    agents = metadata["agents_used"]
                    agent_badges = " ".join([f'<span class="gnh-badge">{agent.title()}</span>' for agent in agents])
                    
                    st.markdown(f"""
                    <div style="margin-left: 1rem; margin-bottom: 1rem;">
                        <small>Agents consulted: {agent_badges}</small>
                    </div>
                    """, unsafe_allow_html=True)
                
                # Sources
                if "sources" in metadata and metadata["sources"]:
                    with st.expander("📚 Sources & References", expanded=False):
                        for source in metadata["sources"]:
                            st.markdown(f"""
                            **{source.get('title', 'Unknown')}**  
                            Department: {source.get('department', 'N/A')}  
                            Type: {source.get('document_type', 'N/A')}  
                            Relevance: {source.get('relevance_score', 0):.1%}
                            """)
                
                # Follow-up suggestions
                if "follow_up_suggestions" in metadata and metadata["follow_up_suggestions"]:
                    st.markdown("**💡 Related Questions:**")
                    for i, suggestion in enumerate(metadata["follow_up_suggestions"][:3], 1):
                        # Create truly unique key using message counter and timestamp
                        st.session_state.message_counter += 1
                        unique_key = f"followup_{st.session_state.message_counter}_{int(time.time() * 1000)}_{i}"
                        if st.button(f"{i}. {suggestion}", key=unique_key):
                            st.session_state.messages.append({"role": "user", "content": suggestion})
                            self.process_query(suggestion)
                            st.rerun()
                
                # Agent traces (if requested)
                if "agent_traces" in metadata and metadata["agent_traces"]:
                    with st.expander("🔍 AI Reasoning Process", expanded=False):
                        for trace in metadata["agent_traces"]:
                            st.markdown(f"""
                            **{trace.get('agent_name', 'Unknown Agent')}**  
                            Reasoning: {trace.get('reasoning', 'N/A')}  
                            Confidence: {trace.get('confidence', 0):.1%}  
                            Processing Time: {trace.get('processing_time', 0):.2f}s
                            """)
                            
                            if trace.get('decision_factors'):
                                st.markdown("Decision Factors:")
                                for factor in trace['decision_factors']:
                                    st.markdown(f"• {factor}")
    
    def get_confidence_class(self, confidence: float) -> str:
        """Get CSS class for confidence score"""
        if confidence >= 0.8:
            return "confidence-high"
        elif confidence >= 0.6:
            return "confidence-medium"
        else:
            return "confidence-low"
    
    def process_query(self, query: str, include_traces: bool = False):
        """Process user query through the backend"""
        try:
            with st.spinner("🤔 Consulting with government experts..."):
                try:
                    # Prepare request
                    request_data = {
                        "query": query,
                        "user_profile": st.session_state.user_profile,
                        "session_id": st.session_state.session_id,
                        "include_traces": include_traces
                    }
                    
                    # Make API call
                    response = requests.post(
                        f"{API_BASE_URL}/api/query",
                        json=request_data,
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        
                        # Update session ID
                        st.session_state.session_id = result.get("session_id")
                        
                        # Add assistant response
                        assistant_message = {
                            "role": "assistant",
                            "content": result["response"],
                            "metadata": {
                                "confidence_score": result.get("confidence_score", 0),
                                "agents_used": result.get("agents_used", []),
                                "sources": result.get("sources", []),
                                "follow_up_suggestions": result.get("follow_up_suggestions", []),
                                "agent_traces": result.get("agent_traces", []) if include_traces else [],
                                "processing_time": result.get("processing_time", 0)
                            }
                        }
                        
                        st.session_state.messages.append(assistant_message)
                        
                        # Update conversation history
                        st.session_state.conversation_history.append({
                            "timestamp": datetime.now().isoformat(),
                            "query": query,
                            "response": result["response"],
                            "confidence": result.get("confidence_score", 0)
                        })
                    
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                        
                        # Add error message
                        error_message = {
                            "role": "assistant",
                            "content": "I apologize, but I'm experiencing technical difficulties. Please try again or contact support if the problem persists.",
                            "metadata": {"confidence_score": 0.1, "agents_used": [], "sources": []}
                        }
                        st.session_state.messages.append(error_message)
                
                except requests.exceptions.Timeout:
                    st.error("Request timed out. Please try again.")
                    
                    timeout_message = {
                        "role": "assistant", 
                        "content": "I apologize, but your request is taking longer than expected. Please try again with a simpler question.",
                        "metadata": {"confidence_score": 0.1, "agents_used": [], "sources": []}
                    }
                    st.session_state.messages.append(timeout_message)
                
                except requests.exceptions.ConnectionError:
                    st.error("Cannot connect to GovBot service. Please check if the backend is running.")
                    
                    connection_message = {
                        "role": "assistant",
                        "content": "I'm currently unable to connect to the government services. Please try again later or contact technical support.",
                        "metadata": {"confidence_score": 0.1, "agents_used": [], "sources": []}
                    }
                    st.session_state.messages.append(connection_message)
                
                except Exception as e:
                    st.error(f"Unexpected error: {str(e)}")
                    
                    error_message = {
                        "role": "assistant",
                        "content": "I encountered an unexpected error. Please try rephrasing your question or contact support.",
                        "metadata": {"confidence_score": 0.1, "agents_used": [], "sources": []}
                    }
                    st.session_state.messages.append(error_message)
        
        except Exception as e:
            # Catch-all to prevent the entire interface from breaking
            st.error(f"Critical error in query processing: {str(e)}")
            # logger.error(f"Critical error in process_query: {e}")
    
    def render_welcome_message(self):
        """Render welcome message for new users"""
        if not st.session_state.messages:
            st.markdown("""
            <div class="chat-message bot-message">
                <strong>🇧🇹 GovBot:</strong><br>
                <strong>Kuzu zangpo la!</strong> Welcome to Druk Yoezer, your AI-powered digital civil Assistant. 
                I'm here to help you navigate government services, understand regulations, and provide guidance 
                aligned with our Gross National Happiness principles.
                <br><br>
                <strong>I can help you with:</strong><br>
                🏢 Business registration and licensing<br>
                📋 Government procedures and requirements<br>
                💰 Tax information and calculations<br>
                🌍 eResidency and immigration services<br>
                🏛️ Cultural guidance and etiquette<br>
                📄 Document requirements and processes<br>
                <br>
                Please select your profile in the sidebar and ask me anything about government services in Bhutan!
            </div>
            """, unsafe_allow_html=True)
    
    def render_footer(self):
        """Render footer with additional information"""
        st.markdown("---")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("""
            **🏛️ Government Services**
            - [Department of Industry](http://www.industry.gov.bt)
            - [Department of Immigration](http://www.immigration.gov.bt)
            - [Tourism Council of Bhutan](http://www.tourism.gov.bt)
            """)
        
        with col2:
            st.markdown("""
            **📚 Resources**
            - [Bhutan Portal](http://www.bhutan.gov.bt)
            - [eGovernment Services](http://www.citizenservices.gov.bt)
            - [Legal Information](http://www.nab.gov.bt)
            """)
        
        with col3:
            st.markdown("""
            **🌸 GNH Information**
            - [Centre for Bhutan Studies](http://www.bhutanstudies.org.bt)
            - [GNH Commission](http://www.gnhc.gov.bt)
            - [Cultural Programs](http://www.culture.gov.bt)
            """)
        
        st.markdown("""
        <div style="text-align: center; margin-top: 2rem; padding: 1rem; background-color: #f8f9fa; border-radius: 8px;">
            <small>
                <strong>Druk Yoezer</strong> - E-Bhutan Hackathon 2025<br>
                Powered by AI • Guided by Gross National Happiness • Serving the Kingdom of Bhutan<br>
                <em>This is an AI assistant. For official matters, please contact relevant government departments.</em>
            </small>
        </div>
        """, unsafe_allow_html=True)
    
    def run(self):
        """Main application runner"""
        # Render header
        self.render_header()
        
        # Create main layout
        col1, col2 = st.columns([3, 1])
        
        with col2:
            self.render_sidebar()
        
        with col1:
            # Welcome message
            self.render_welcome_message()
            
            # Chat interface
            self.render_chat_interface()
        
        # Footer
        self.render_footer()

# Main application
def main():
    """Main function"""
    try:
        # Initialize and run the interface
        govbot_interface = GovBotInterface()
        govbot_interface.run()
        
    except Exception as e:
        st.error(f"Application error: {str(e)}")
        st.markdown("""
        **Troubleshooting:**
        1. Ensure the backend server is running on http://localhost:8000
        2. Check your internet connection
        3. Try refreshing the page
        4. Contact technical support if the problem persists
        """)

if __name__ == "__main__":
    main()
