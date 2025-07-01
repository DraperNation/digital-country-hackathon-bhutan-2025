
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

from model_router import model_router
from functions.llm_inference import llm_inference
from coding_agent import run_coding_agent
from thinking_agent import run_thinking_agent

# ────────────────────────────── 0. ENV / CONFIG ──────────────────────────────
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_DB   = os.getenv("PG_DB",   "lhaden_db")
PG_USER = os.getenv("PG_USER", "lhaden_rw")
PG_PASS = os.getenv("PG_PASS", "secret‑shhh")
PG_PORT = int(os.getenv("PG_PORT", "5432"))

LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")


# ────────────────────────────── 1. DB HELPERS ────────────────────────────────
def _fetch_model_options() -> List[Dict[str, Any]]:
    """
    Grab the active model catalogue from Postgres.

    Returns
    -------
    List[Dict[str, Any]]
        Example item: {'model_name': 'coding-agent', 'category': 'Coding requests', …}
    """
    sql = """
        SELECT model_name, category, description
          FROM lhaden_model_options
         WHERE is_active = TRUE
    """
    conn = psycopg2.connect(
        host=PG_HOST, port=PG_PORT, dbname=PG_DB, user=PG_USER, password=PG_PASS
    )
    try:
        with conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql)
            rows = cur.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ────────────────────────────── 2. DISPATCHER ────────────────────────────────
def _call_selected_model(model_name: str, user_query: str) -> str:
    """
    Fan‑out to the correct backend engine or helper agent.

    Falls back to `thinking-agent` when unsure.
    """
    key = model_name.lower()

    if key in {"coding-agent", "coding_agent"}:
        LOGGER.info("💻  Handing off to Coding Agent")
        return run_coding_agent(user_query)

    if key in {"thinking-agent", "thinking_agent"}:
        LOGGER.info("🧠  Handing off to Thinking Agent")
        return run_thinking_agent(user_query)

    # All Bhutan domain‑specific models or service builders land here.
    # We assume `llm_inference` accepts a `model` kwarg to target the right hosted checkpoint.
    LOGGER.info("🏔️  Handing off to Bhutan model ➜ %s", model_name)
    return llm_inference(user_query)


# ────────────────────────────── 3. PUBLIC API ────────────────────────────────
def lhaden_core(email_id: str, user_query: str) -> str:
    """
    Top‑level orchestrator.

    Parameters
    ----------
    email_id : str
        Caller’s email – handy for audit logs or future per‑user context.
    user_query : str
        Natural‑language prompt fresh from the user.

    Returns
    -------
    str
        Raw assistant reply produced by the chosen model.
    """
    LOGGER.info("🚦  Lhaden_core activated for %s", email_id)

    # 1️⃣  Pull model catalogue
    try:
        model_options = _fetch_model_options()
    except Exception as exc:
        return run_thinking_agent(user_query)

    # 2️⃣  Ask the router which engine should take the wheel
    try:
        selected_model: Optional[str] = model_router(model_options, user_query)
    except Exception as exc:
        return run_thinking_agent(user_query)

    # 3️⃣  Safety net: if router returned None or unknown, dream‑storm with Thinking Agent
    if not selected_model:
        return run_thinking_agent(user_query)

    # 4️⃣  Fire the chosen model / agent
    try:
        return _call_selected_model(selected_model, user_query)
    except Exception:
        return run_thinking_agent(user_query)
