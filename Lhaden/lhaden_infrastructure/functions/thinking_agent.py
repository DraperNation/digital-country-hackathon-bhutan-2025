from pathlib import Path
from functions.llm_inference import llm_inference

# Points to <repo_root>/prompts
_PROMPT_DIR = Path(__file__).resolve().parents[1] / "prompts"


def _load_prompt(name: str) -> str:
    """Read a prompt text file from the prompts directory."""
    return (_PROMPT_DIR / f"{name}.txt").read_text()


def run_thinking_agent(user_query: str) -> str:
    """
    Fire up the coding agent!

    Parameters
    ----------
    user_query : str
        Natural‑language request from the user.

    Returns
    -------
    str
        Raw content returned by the model.
    """
    # 1️⃣  Grab the system prompt for the coding agent
    system_prompt = _load_prompt("thinking_agent")

    # 2️⃣  Concatenate system prompt + user query
    composed_prompt = f"{system_prompt}\n\nUser query:\n{user_query}"

    # 3️⃣  Let the LLM work its magic
    response = llm_inference(composed_prompt)

    return response
