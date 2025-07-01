from flask import Flask, render_template, request
from src.ollama_utils import talk_to_bhutan_bot

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    reply = None
    if request.method == "POST":
        user_message = request.form["message"]
        user_language = request.form.get("language", "english")
        reply = talk_to_bhutan_bot(user_message, user_language=user_language)

    return render_template("chat.html", bot_reply=reply)

if __name__ == "__main__":
    app.run(debug=True)
