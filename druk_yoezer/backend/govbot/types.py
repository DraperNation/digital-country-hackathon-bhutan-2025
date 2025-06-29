"""
Shared types for GovBot Bhutan
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class AgentResult:
    """Result from an agent execution"""
    response: str
    confidence_score: float
    sources: List[Dict[str, Any]]
    reasoning: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
