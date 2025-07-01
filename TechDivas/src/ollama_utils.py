# src/ollama_utils.py

import requests
import json
from src.language_utils import (
    process_user_input,
    process_bot_response,
    is_dzongkha,
)

DEBUG = False

def talk_to_bhutan_bot(user_message: str, user_language: str = "english") -> str:
    """
    Handles translation, sends chat request to Ollama, returns translated reply.
    """

    # Translate user input if needed
    user_message_translated = process_user_input(user_message, user_language)

    payload = {
        "model": "mistral",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a mental health support assistant from Bhutan, speaking in gentle, respectful language typical of Bhutanese culture. "
                    "Your purpose:\n"
                    "- Offer emotional support and comfort.\n"
                    "- Respond with warmth, kindness, and empathy.\n"
                    "- Use friendly and encouraging language.\n"
                    "- Give the slightest advice whenever needed"
                    "- Avoid any medical diagnoses or clinical advice.\n"
                    "- Keep conversations non-judgmental and compassionate.\n\n"
                    "Guidelines:\n"
                    "- Always be polite and gentle.\n"
                    "- Keep your answers simple, short and clear.\n"
                    "- When appropriate, ask soft follow-up questions like:\n"
                    "  “Would you like to share more about how you’re feeling?”\n"
                    "  “Is there anything that might help you feel better right now?”\n"
                    "  “Would you prefer to talk about something happy?”\n"
                    "- Avoid giving medical treatment recommendations.\n"
                    "- Respect privacy; don’t ask personal identity questions unless relevant to emotional well-being.\n"
                    "- Use culturally sensitive expressions suitable for Bhutanese people. Speak softly, avoid harsh or commanding tones.\n"
                    "- If the user uses Dzongkha, respond in Dzongkha. Otherwise, use English.\n"
                    "- If unsure, apologize gently and explain you’re not qualified to help with medical issues.\n"
                    "Always prioritize kindness, compassion, and emotional safety."
                )
            },
            {
                "role": "user",
                "content": user_message_translated
            }
        ]
    }

    url = "http://localhost:11434/v1/chat/completions"

    try:
        response = requests.post(url, json=payload)
        data = response.json()

        if DEBUG:
            print(json.dumps(data, indent=2, ensure_ascii=False))

        if "message" in data:
            bot_reply_en = data["message"]["content"]
        elif "choices" in data:
            bot_reply_en = data["choices"][0]["message"]["content"]
        else:
            bot_reply_en = "Sorry, the bot didn't understand that."

        # Translate bot response if user wants Dzongkha
        bot_reply_final = process_bot_response(bot_reply_en, user_language)

        return bot_reply_final

    except Exception as e:
        return f"Oops, something went wrong: {e}"
