"""
GovBot Bhutan - FastAPI Backend Server
E-Bhutan Hackathon 2024
"""

import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from govbot.orchestrator import GovBotOrchestrator
from govbot.models import (
    QueryRequest, 
    QueryResponse, 
    UserProfile, 
    AgentTrace,
    HealthResponse
)
from govbot.rag_system import RAGSystem
from govbot.utils import setup_logging, get_session_id

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global instances
orchestrator: Optional[GovBotOrchestrator] = None
rag_system: Optional[RAGSystem] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global orchestrator, rag_system
    
    logger.info("🇧🇹 Initializing GovBot Bhutan...")
    
    # Initialize RAG system
    rag_system = RAGSystem()
    await rag_system.initialize()
    
    # Initialize orchestrator
    orchestrator = GovBotOrchestrator(rag_system)
    await orchestrator.initialize()
    
    logger.info("✅ GovBot Bhutan initialized successfully!")
    
    yield
    
    logger.info("🔄 Shutting down GovBot Bhutan...")
    if rag_system:
        await rag_system.cleanup()

# Create FastAPI app
app = FastAPI(
    title="GovBot Bhutan API",
    description="AI-powered digital civil servant for the Kingdom of Bhutan",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501", "http://127.0.0.1:8501"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session storage (in production, use Redis or database)
sessions: Dict[str, Dict[str, Any]] = {}

def get_orchestrator() -> GovBotOrchestrator:
    """Dependency to get orchestrator instance"""
    if orchestrator is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    return orchestrator

def get_rag_system() -> RAGSystem:
    """Dependency to get RAG system instance"""
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    return rag_system

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with welcome message"""
    return {
        "message": "🇧🇹 Welcome to GovBot Bhutan - Your Digital Civil Servant",
        "version": "1.0.0",
        "status": "operational",
        "philosophy": "Guided by Gross National Happiness"
    }

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check orchestrator
        orchestrator_status = "healthy" if orchestrator else "unhealthy"
        
        # Check RAG system
        rag_status = "healthy" if rag_system and await rag_system.health_check() else "unhealthy"
        
        overall_status = "healthy" if orchestrator_status == "healthy" and rag_status == "healthy" else "unhealthy"
        
        return HealthResponse(
            status=overall_status,
            timestamp=datetime.utcnow(),
            components={
                "orchestrator": orchestrator_status,
                "rag_system": rag_status,
                "database": "healthy"  # Mock for demo
            }
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.post("/api/query", response_model=QueryResponse)
async def process_query(
    request: QueryRequest,
    background_tasks: BackgroundTasks,
    orchestrator: GovBotOrchestrator = Depends(get_orchestrator)
):
    """Process user query through the multi-agent system"""
    try:
        session_id = request.session_id or get_session_id()
        
        # Get or create session
        if session_id not in sessions:
            sessions[session_id] = {
                "created_at": datetime.utcnow(),
                "conversation_history": [],
                "user_profile": request.user_profile.dict() if request.user_profile else {}
            }
        
        session = sessions[session_id]
        
        logger.info(f"Processing query for session {session_id}: {request.query[:100]}...")
        
        # Process query through orchestrator
        result = await orchestrator.process_query(
            query=request.query,
            user_profile=request.user_profile,
            session_context=session,
            include_traces=request.include_traces
        )
        
        # Update session
        session["conversation_history"].append({
            "timestamp": datetime.utcnow(),
            "query": request.query,
            "response": result["response"],
            "agents_used": result["agents_used"]
        })
        
        # Background task for analytics
        background_tasks.add_task(log_query_analytics, session_id, request.query, result)
        
        return QueryResponse(
            response=result["response"],
            confidence_score=result["confidence_score"],
            sources=result["sources"],
            agents_used=result["agents_used"],
            agent_traces=result.get("agent_traces", []),
            follow_up_suggestions=result["follow_up_suggestions"],
            cultural_context=result.get("cultural_context"),
            session_id=session_id
        )
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/api/session/{session_id}/history")
async def get_session_history(session_id: str):
    """Get conversation history for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "history": sessions[session_id]["conversation_history"][-10:],  # Last 10 messages
        "user_profile": sessions[session_id]["user_profile"]
    }

@app.post("/api/session/{session_id}/profile")
async def update_user_profile(session_id: str, profile: UserProfile):
    """Update user profile for a session"""
    if session_id not in sessions:
        sessions[session_id] = {
            "created_at": datetime.utcnow(),
            "conversation_history": [],
            "user_profile": {}
        }
    
    sessions[session_id]["user_profile"] = profile.dict()
    
    return {"message": "Profile updated successfully"}

@app.get("/api/sample-questions")
async def get_sample_questions():
    """Get sample questions for different user types"""
    return {
        "foreign_entrepreneur": [
            "How do I register a tech company in Bhutan as a foreign entrepreneur?",
            "What are the eResidency requirements and benefits?",
            "What are the tax implications for a digital nomad doing business in Bhutan?"
        ],
        "local_business": [
            "How does Gross National Happiness philosophy apply to business practices?",
            "What permits do I need for a tourism business in Thimphu?",
            "How can I get government funding for a sustainable agriculture project?"
        ],
        "general_citizen": [
            "How do I apply for a passport renewal?",
            "What are the requirements for building a house in rural areas?",
            "How can I register for social security benefits?"
        ]
    }

@app.get("/api/agents/status")
async def get_agents_status(orchestrator: GovBotOrchestrator = Depends(get_orchestrator)):
    """Get status of all agents"""
    return await orchestrator.get_agents_status()

async def log_query_analytics(session_id: str, query: str, result: Dict[str, Any]):
    """Background task for logging analytics"""
    try:
        # In production, this would log to analytics service
        logger.info(f"Analytics - Session: {session_id}, Agents: {result['agents_used']}, Confidence: {result['confidence_score']}")
    except Exception as e:
        logger.error(f"Analytics logging failed: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
