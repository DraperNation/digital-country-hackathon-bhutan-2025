from os import getenv
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=getenv("OPENROUTER_API_KEY"),
)


def llm_inference(input_query: str) -> str:
    """Run LLM inference using the configured OpenRouter client."""
    completion = client.chat.completions.create(
        extra_body={},
        model="deepseek/deepseek-r1:free",
        messages=[{"role": "user", "content": f"{input_query}"}],
    )

    return completion.choices[0].message.content
