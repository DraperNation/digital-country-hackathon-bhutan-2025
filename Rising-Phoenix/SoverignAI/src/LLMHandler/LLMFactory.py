from src.LLMHandler.GeminiHandler import GeminiHandler


class LLMFactory:
    def create_llm(self, llm_type: str, **kwargs):
        if llm_type == "Gemini":
            return GeminiHandler(**kwargs)
        else:
            raise ValueError(f"Unsupported LLM type: {llm_type}")


# Example usage of the factory:
# factory = LLMFactory()
# llm = factory.create_llm("Gemini", model_kwargs={"temperature": 0.1}) 