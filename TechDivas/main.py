from fastapi import FastAPI, Request
from pydantic import BaseModel
import csv
import os

from src.translation_utils import translate_dzongkha_to_english, dzongkha_dict, translator_pipeline
from src.sentiment_utils import analyze_sentiment

app = FastAPI()

DATA_PATH = os.path.join("data", "happiness_log.csv")

# Define request schema
class AnalyzeRequest(BaseModel):
    user_id: str
    dzongkha_text: str

# Create CSV file if it doesn't exist
if not os.path.exists(DATA_PATH):
    with open(DATA_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["user_id", "dzongkha_text", "english_text", "happiness_score"])

@app.post("/analyze")
def analyze_text(request: AnalyzeRequest):
    dz_text = request.dzongkha_text
    user_id = request.user_id

    eng_text = translate_dzongkha_to_english(
        dz_text,
        dzongkha_dict,
        translator_pipeline
    )

    if eng_text == "[Translation unavailable]":
        happiness = None
    else:
        happiness = analyze_sentiment(eng_text)

    # Save to CSV
    with open(DATA_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([user_id, dz_text, eng_text, happiness])

    return {
        "user_id": user_id,
        "english_translation": eng_text,
        "happiness_index": happiness
    }

from src.ollama_utils import talk_to_bhutan_bot

class ChatRequest(BaseModel):
    user_id: str
    user_message: str
    user_language: str = "english"  # default to English

@app.post("/chat")
def chat_with_bot(request: ChatRequest):
    reply = talk_to_bhutan_bot(
        request.user_message,
        user_language=request.user_language
    )
    return {
        "user_id": request.user_id,
        "bot_reply": reply
    }
