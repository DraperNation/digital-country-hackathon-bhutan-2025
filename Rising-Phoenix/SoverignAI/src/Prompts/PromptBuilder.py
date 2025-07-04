# prompt_builder.py
from src.Prompts.guidelines import GUIDELINES
from src.Prompts.instructions import INSTRUCTIONS
from src.Prompts.persona import PERSONA


class PromptBuilder:
    def __init__(self):
        self.persona = PERSONA
        self.instructions = INSTRUCTIONS
        self.guidelines = GUIDELINES

    def get_combined_prompt(self, user_query):
        combined_prompt = (
            f"{self.persona}\n\n"
            f"{self.instructions}\n\n"
            f"{self.guidelines}\n\n"
            f"User: {user_query}\n"
            "Assistant:"
        )
        return combined_prompt 