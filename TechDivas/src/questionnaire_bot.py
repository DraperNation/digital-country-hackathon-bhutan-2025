import json
import os

def load_questionnaire(path="data\questionnaire.json"):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def run_questionnaire():
    questionnaire = load_questionnaire()

    print("✨ Welcome to the Gross National Happiness Questionnaire ✨\n")

    # Let user pick language
    print("Please choose your language / ཁྱོད་ཀྱིས་སྐད་ཡིག་འདེམས།")
    print("[1] English")
    print("[2] རྫོང་ཁ་ (Dzongkha)")

    while True:
        lang_choice = input("Enter 1 or 2: ").strip()
        if lang_choice == "1":
            LANGUAGE = "en"
            break
        elif lang_choice == "2":
            LANGUAGE = "dz"
            break
        else:
            print("Invalid choice. Please enter 1 or 2.")

    total_score = 0
    for q in questionnaire:
        question_text = q["question_en"] if LANGUAGE == "en" else q["question_dz"]
        print(f"\n👉 {question_text}")

        for i, option in enumerate(q["options"], start=1):
            option_text = option["text_en"] if LANGUAGE == "en" else option["text_dz"]
            print(f"   [{i}] {option_text}")
        
        while True:
            choice = input("Your choice (number): ").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(q["options"]):
                chosen_option = q["options"][int(choice)-1]
                total_score += chosen_option["score"]
                print(f"✅ You selected: {chosen_option['text_en']}\n")
                break
            else:
                print("Oops! Invalid choice. Try again!")

    avg_score = total_score / len(questionnaire)

    if avg_score >= 8:
        advice_en = "💖 You're glowing with happiness! Keep shining!"
        advice_dz = "💖 ཁྱོད་ཀྱིས་དགའ་བ་ལས་མེད་པར་འོང་གི་རེད། མཚན་ཉམས་འབད།"
    elif avg_score >= 5:
        advice_en = "🌈 You're doing okay, but take time for yourself and do something joyful today."
        advice_dz = "🌈 ཁྱོད་ལུ་གནོད་མེད་འབད་དོ་ཡི་རེད། ད་རེས་ཁྱོད་རང་གི་དོན་ལུ་བསྐྱར་ལམ་འབད།"
    else:
        advice_en = "💙 You're feeling low. Remember it's okay to talk to someone and take care of your mental health."
        advice_dz = "💙 ཁྱོད་ལུ་སེམས་ནད་སྣང་བ་ཡོད་ན་སྤྱད་སྒོ་རེ་མེད། གལ་ཏེ་གལ་ཆེ་བ་མེད་སྦེ་མི་སུ་ལུ་སྐད་ཆ་འབད།"

    # Show advice in chosen language
    if LANGUAGE == "en":
        advice = advice_en
    else:
        advice = advice_dz

    print("🎉 Questionnaire complete!")
    print(f"Your average happiness score: {avg_score:.2f} / 10")
    print(f"✨ Advice: {advice}")

if __name__ == "__main__":
    run_questionnaire()
