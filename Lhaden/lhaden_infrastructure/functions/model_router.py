from typing import Any, Dict, List
from pathlib import Path
import re
from functions.llm_inference import llm_inference

_PROMPT_DIR = Path(__file__).resolve().parents[1] / "prompts"


def _load_prompt(name: str) -> str:
    return (_PROMPT_DIR / f"{name}.txt").read_text()


def _extract_tool(response: str) -> str:
    match = re.search(r"model:\s*(\w+)", response)
    return match.group(1) if match else "None"


def model_router(
    model_options: List[Dict[str, Any]],
    search_query: str
) -> Dict[str, Any]:
    """Determine or validate the search tool for the current step."""

    prompt = _load_prompt("model_router")
    query = (
        f"{prompt}\n\nmodel_options: {model_options}\n"
        f"search_query: {search_query}\n"
    )

    response = llm_inference(query)
    model_name = _extract_tool(response)
    model_selection = None if model_name == "None" else model_name
    return model_selection
