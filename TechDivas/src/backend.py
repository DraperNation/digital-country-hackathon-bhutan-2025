from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("data/questionnaire.json", encoding="utf-8") as f:
    questionnaire = json.load(f)

# Conversation sessions stored in memory for demo purposes
user_sessions = {}

@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()

    user_id = "user1"  # In real life, you'd identify the user via cookies etc.

    session = user_sessions.get(user_id, {
        "language": None,
        "current_q": 0,
        "total_score": 0
    })

    user_message = data.get("user_message")

    # 1) If language not picked yet
    if session["language"] is None:
        if user_message.strip() in ["1", "2"]:
            session["language"] = "en" if user_message == "1" else "dz"
            user_sessions[user_id] = session
            q = questionnaire[0]
            question_text = q["question_en"] if session["language"] == "en" else q["question_dz"]
            options = [opt["text_en"] if session["language"] == "en" else opt["text_dz"] for opt in q["options"]]
            return JSONResponse({
                "bot_reply": question_text,
                "options": options,
                "question_number": 1
            })
        else:
            return JSONResponse({
                "bot_reply": "Please choose your language:\n[1] English\n[2] རྫོང་ཁ་ (Dzongkha)"
            })

    # 2) Answering questions
    else:
        current_q = session["current_q"]
        if current_q < len(questionnaire):
            q = questionnaire[current_q]
            try:
                choice_index = int(user_message) - 1
                chosen_option = q["options"][choice_index]
                session["total_score"] += chosen_option["score"]
                session["current_q"] += 1
            except:
                return JSONResponse({
                    "bot_reply": "Invalid choice! Please enter a valid option number."
                })

        # Check if finished
        if session["current_q"] >= len(questionnaire):
            avg_score = session["total_score"] / len(questionnaire)
            if avg_score >= 8:
                advice = "💖 You're glowing with happiness! Keep shining!"
            elif avg_score >= 5:
                advice = "🌈 You're doing okay, but take time for yourself and do something joyful today."
            else:
                advice = "💙 You're feeling low. Remember it's okay to talk to someone and take care of your mental health."

            user_sessions.pop(user_id, None)

            return JSONResponse({
                "bot_reply": f"🎉 Questionnaire complete!\nYour average happiness score: {avg_score:.2f} / 10\n✨ Advice: {advice}",
                "options": None
            })
        else:
            # Send next question
            q = questionnaire[session["current_q"]]
            question_text = q["question_en"] if session["language"] == "en" else q["question_dz"]
            options = [opt["text_en"] if session["language"] == "en" else opt["text_dz"] for opt in q["options"]]

            user_sessions[user_id] = session

            return JSONResponse({
                "bot_reply": question_text,
                "options": options,
                "question_number": session["current_q"] + 1
            })
