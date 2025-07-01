"""
Pydantic models for GovBot Bhutan API
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class UserType(str, Enum):
    """User type enumeration"""
    CITIZEN = "citizen"  # Changed from GENERAL_CITIZEN
    FOREIGN_ENTREPRENEUR = "foreign_entrepreneur"
    LOCAL_BUSINESS = "local_business"
    TOURIST = "tourist"
    GOVERNMENT_OFFICIAL = "government_official"

class UserProfile(BaseModel):
    """User profile information"""
    user_type: UserType
    location: Optional[str] = None
    business_sector: Optional[str] = None
    language_preference: str = "en"
    experience_level: Optional[str] = None

class QueryRequest(BaseModel):
    """Request model for query processing"""
    query: str = Field(..., min_length=1, max_length=2000)
    user_profile: Optional[UserProfile] = None
    session_id: Optional[str] = None
    include_traces: bool = False
    context: Optional[Dict[str, Any]] = None

class AgentTrace(BaseModel):
    """Trace information for agent execution"""
    agent_name: str
    execution_time: float
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]
    confidence_score: float
    reasoning: Optional[str] = None

class QueryResponse(BaseModel):
    """Response model for query processing"""
    response: str
    confidence_score: float
    sources: List[Dict[str, Any]]
    agents_used: List[str]
    agent_traces: Optional[List[AgentTrace]] = None
    follow_up_suggestions: List[str]
    cultural_context: Optional[str] = None
    session_id: str

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    timestamp: datetime
    components: Dict[str, str]
