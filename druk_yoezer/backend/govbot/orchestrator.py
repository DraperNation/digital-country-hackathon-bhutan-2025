"""
Multi-Agent Orchestrator for GovBot Bhutan
Coordinates between different specialized agents using LangGraph
"""

import logging
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional

from langchain.schema import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

from .models import UserProfile, AgentTrace
from .rag_system import RAGSystem
from .agents.legal_agent import LegalAgent
from .agents.cultural_agent import CulturalAgent
from .agents.procedural_agent import ProceduralAgent
from .agents.economic_agent import EconomicAgent
from .agents.translation_agent import TranslationAgent
from .types import AgentResult

logger = logging.getLogger(__name__)

class AgentState(TypedDict):
    """State shared between agents"""
    messages: Annotated[List[BaseMessage], add_messages]
    query: str
    user_profile: Optional[UserProfile]
    session_context: Dict[str, Any]
    agent_results: Dict[str, AgentResult]
    final_response: Optional[str]
    confidence_score: float
    sources: List[Dict[str, Any]]
    follow_up_suggestions: List[str]
    cultural_context: Optional[str]
    include_traces: bool
    agent_traces: List[AgentTrace]
    agents_needed: set
    current_agent_index: int

class GovBotOrchestrator:
    """Main orchestrator that coordinates multiple AI agents"""
    
    def __init__(self, rag_system: RAGSystem):
        self.rag_system = rag_system
        self.agents = {}
        self.workflow = None
        self.initialized = False
        
    async def initialize(self):
        """Initialize all agents and create the workflow graph"""
        logger.info("Initializing GovBot Orchestrator...")
        
        try:
            # Initialize all agents
            self.agents = {
                "legal": LegalAgent(self.rag_system),
                "cultural": CulturalAgent(self.rag_system),
                "procedural": ProceduralAgent(self.rag_system),
                "economic": EconomicAgent(self.rag_system),
                "translation": TranslationAgent(self.rag_system)
            }
            
            # Initialize each agent
            for agent_name, agent in self.agents.items():
                await agent.initialize()
                logger.info(f"✅ Initialized {agent_name} agent")
            
            # Create workflow graph
            self._create_workflow()
            
            self.initialized = True
            logger.info("✅ GovBot Orchestrator initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize orchestrator: {e}")
            raise
    
    def _create_workflow(self):
        """Create the LangGraph workflow for agent coordination"""
        
        # Define the workflow graph
        workflow = StateGraph(AgentState)
        
        # Add nodes for each agent
        workflow.add_node("router", self._route_query)
        workflow.add_node("agent_executor", self._execute_next_agent)
        workflow.add_node("synthesizer", self._synthesize_response)
        
        # Define the workflow edges
        workflow.set_entry_point("router")
        
        # Router to agent executor
        workflow.add_edge("router", "agent_executor")
        
        # Agent executor conditional edge
        workflow.add_conditional_edges(
            "agent_executor",
            self._should_continue_agents,
            {
                "continue": "agent_executor",
                "synthesize": "synthesizer"
            }
        )
        
        # Synthesizer ends the workflow
        workflow.add_edge("synthesizer", END)
        
        # Compile the workflow
        self.workflow = workflow.compile()
    
    async def _route_query(self, state: AgentState) -> AgentState:
        """Route the query to determine which agents should be called"""
        query = state["query"].lower()
        user_profile = state["user_profile"]
        
        # Determine which agents are needed based on query content and user profile
        agents_needed = set()
        
        # Legal agent keywords
        legal_keywords = ["law", "legal", "regulation", "compliance", "permit", "license", "registration", "requirement"]
        if any(keyword in query for keyword in legal_keywords):
            agents_needed.add("legal")
        
        # Cultural agent keywords
        cultural_keywords = ["culture", "tradition", "gnh", "happiness", "festival", "custom", "dzongkha", "buddhist"]
        if any(keyword in query for keyword in cultural_keywords):
            agents_needed.add("cultural")
        
        # Procedural agent keywords
        procedural_keywords = ["how to", "process", "step", "procedure", "apply", "application", "form", "document"]
        if any(keyword in query for keyword in procedural_keywords):
            agents_needed.add("procedural")
        
        # Economic agent keywords
        economic_keywords = ["tax", "business", "investment", "economy", "finance", "cost", "fee", "money", "entrepreneur"]
        if any(keyword in query for keyword in economic_keywords):
            agents_needed.add("economic")
        
        # Translation agent (for non-English queries or if user prefers Dzongkha)
        if user_profile and hasattr(user_profile, 'language_preference') and user_profile.language_preference != "english":
            agents_needed.add("translation")
        
        # Default to procedural if no specific agent identified
        if not agents_needed:
            agents_needed.add("procedural")
        
        state["agents_needed"] = agents_needed
        state["current_agent_index"] = 0
        
        logger.info(f"Routing query to agents: {agents_needed}")
        
        return state
    
    async def _execute_next_agent(self, state: AgentState) -> AgentState:
        """Execute the next agent in the queue"""
        agents_needed = list(state["agents_needed"])
        current_index = state["current_agent_index"]
        
        if current_index >= len(agents_needed):
            return state
        
        agent_name = agents_needed[current_index]
        agent = self.agents[agent_name]
        
        try:
            start_time = datetime.utcnow()
            
            logger.info(f"Executing {agent_name} agent...")
            
            result = await agent.process_query(
                state["query"], 
                state["user_profile"], 
                state["session_context"]
            )
            
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            state["agent_results"][agent_name] = result
            
            if state["include_traces"]:
                state["agent_traces"].append(AgentTrace(
                    agent_name=agent_name,
                    execution_time=execution_time,
                    input_data={"query": state["query"]},
                    output_data={"response": result.response},
                    confidence_score=result.confidence_score,
                    reasoning=result.reasoning
                ))
            
            logger.info(f"{agent_name} agent completed with confidence: {result.confidence_score}")
            
        except Exception as e:
            logger.error(f"{agent_name} agent failed: {e}")
            # Create a fallback result
            state["agent_results"][agent_name] = AgentResult(
                response=f"I apologize, but I'm having trouble accessing {agent_name} information right now.",
                confidence_score=0.1,
                sources=[],
                reasoning="Agent execution failed"
            )
        
        # Move to next agent
        state["current_agent_index"] = current_index + 1
        
        return state
    
    def _should_continue_agents(self, state: AgentState) -> str:
        """Determine if we should continue executing agents or move to synthesis"""
        agents_needed = list(state["agents_needed"])
        current_index = state["current_agent_index"]
        
        if current_index >= len(agents_needed):
            return "synthesize"
        else:
            return "continue"
    
    async def _synthesize_response(self, state: AgentState) -> AgentState:
        """Synthesize responses from all agents into a final response"""
        try:
            agent_results = state["agent_results"]
            
            if not agent_results:
                state["final_response"] = "I apologize, but I couldn't process your query at this time. Please try again later."
                state["confidence_score"] = 0.1
                state["sources"] = []
                state["follow_up_suggestions"] = []
                return state
            
            # Find the agent with the highest confidence
            best_agent = max(agent_results.keys(), key=lambda k: agent_results[k].confidence_score)
            best_result = agent_results[best_agent]
            
            # Start with the best agent's response
            final_response = best_result.response
            
            # If multiple agents were used, combine insights
            if len(agent_results) > 1:
                additional_insights = []
                for agent_name, result in agent_results.items():
                    if agent_name != best_agent and result.confidence_score > 0.5:
                        # Add a brief insight from other high-confidence agents
                        insight = result.response[:200] + "..." if len(result.response) > 200 else result.response
                        additional_insights.append(f"**{agent_name.title()} Perspective:** {insight}")
                
                if additional_insights:
                    final_response += "\n\n**Additional Insights:**\n" + "\n\n".join(additional_insights)
            
            # Collect all sources
            all_sources = []
            for result in agent_results.values():
                all_sources.extend(result.sources)
            
            # Remove duplicate sources
            unique_sources = []
            seen_titles = set()
            for source in all_sources:
                if source.get("title") not in seen_titles:
                    unique_sources.append(source)
                    seen_titles.add(source.get("title"))
            
            # Add cultural context if cultural agent was involved
            cultural_context = None
            if "cultural" in agent_results:
                cultural_context = agent_results["cultural"].response
            
            # Generate follow-up suggestions
            follow_up_suggestions = self._generate_follow_up_suggestions(state["query"], agent_results)
            
            # Calculate overall confidence (weighted average)
            total_confidence = sum(result.confidence_score for result in agent_results.values())
            avg_confidence = total_confidence / len(agent_results) if agent_results else 0.1
            
            state["final_response"] = final_response
            state["confidence_score"] = avg_confidence
            state["sources"] = unique_sources
            state["follow_up_suggestions"] = follow_up_suggestions
            state["cultural_context"] = cultural_context
            
            logger.info(f"Synthesized response with confidence: {avg_confidence}")
            
        except Exception as e:
            logger.error(f"Response synthesis failed: {e}")
            state["final_response"] = "I apologize, but I encountered an error while processing your query. Please try again."
            state["confidence_score"] = 0.1
            state["sources"] = []
            state["follow_up_suggestions"] = []
        
        return state
    
    def _generate_follow_up_suggestions(self, query: str, agent_results: Dict[str, AgentResult]) -> List[str]:
        """Generate follow-up suggestions based on the query and agent results"""
        suggestions = []
        
        query_lower = query.lower()
        
        # Business-related follow-ups
        if any(word in query_lower for word in ["business", "company", "entrepreneur"]):
            suggestions.extend([
                "What are the tax implications for my business type?",
                "How do I comply with GNH principles in my business?",
                "What permits do I need for my specific industry?"
            ])
        
        # Legal follow-ups
        if "legal" in agent_results:
            suggestions.extend([
                "What are the penalties for non-compliance?",
                "How often do these regulations change?",
                "Where can I get legal assistance?"
            ])
        
        # Cultural follow-ups
        if "cultural" in agent_results:
            suggestions.extend([
                "How can I learn more about Bhutanese culture?",
                "What cultural events should I be aware of?",
                "How do I show respect for local customs?"
            ])
        
        # Procedural follow-ups
        if "procedural" in agent_results:
            suggestions.extend([
                "What documents do I need to prepare?",
                "How long does this process typically take?",
                "Can I track the status of my application?"
            ])
        
        # Limit to 3-4 most relevant suggestions
        return suggestions[:4]
    
    async def process_query(
        self, 
        query: str, 
        user_profile: Optional[UserProfile] = None,
        session_context: Optional[Dict[str, Any]] = None,
        include_traces: bool = False
    ) -> Dict[str, Any]:
        """Process a user query through the multi-agent system"""
        
        if not self.initialized:
            raise RuntimeError("Orchestrator not initialized")
        
        try:
            # Initialize state
            initial_state = AgentState(
                messages=[HumanMessage(content=query)],
                query=query,
                user_profile=user_profile,
                session_context=session_context or {},
                agent_results={},
                final_response=None,
                confidence_score=0.0,
                sources=[],
                follow_up_suggestions=[],
                cultural_context=None,
                include_traces=include_traces,
                agent_traces=[],
                agents_needed=set(),
                current_agent_index=0
            )
            
            # Run the workflow
            final_state = await self.workflow.ainvoke(initial_state)
            
            # Return structured result
            return {
                "response": final_state["final_response"],
                "confidence_score": final_state["confidence_score"],
                "sources": final_state["sources"],
                "agents_used": list(final_state["agent_results"].keys()),
                "agent_traces": final_state["agent_traces"] if include_traces else [],
                "follow_up_suggestions": final_state["follow_up_suggestions"],
                "cultural_context": final_state["cultural_context"]
            }
            
        except Exception as e:
            logger.error(f"Query processing failed: {e}")
            return {
                "response": "I apologize, but I encountered an error while processing your query. Please try again later.",
                "confidence_score": 0.1,
                "sources": [],
                "agents_used": [],
                "agent_traces": [],
                "follow_up_suggestions": ["Please try rephrasing your question", "Contact support if the issue persists"],
                "cultural_context": None
            }
    
    async def get_agents_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        status = {}
        
        for agent_name, agent in self.agents.items():
            try:
                # Simple health check for each agent
                status[agent_name] = {
                    "status": "healthy",
                    "initialized": hasattr(agent, 'initialized') and agent.initialized,
                    "last_check": datetime.utcnow().isoformat()
                }
            except Exception as e:
                status[agent_name] = {
                    "status": "unhealthy",
                    "error": str(e),
                    "last_check": datetime.utcnow().isoformat()
                }
        
        return {
            "orchestrator_status": "healthy" if self.initialized else "unhealthy",
            "agents": status,
            "total_agents": len(self.agents),
            "healthy_agents": sum(1 for s in status.values() if s["status"] == "healthy")
        }
