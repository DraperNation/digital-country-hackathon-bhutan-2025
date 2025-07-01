import json
import os
from transformers import pipeline

# Find repo root no matter where we run from
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
dict_path = os.path.join(repo_root, "data", "dzongkha_dict.json")

with open(dict_path, "r", encoding="utf-8") as f:
    dzongkha_dict = json.load(f)

# Translation pipeline
translator_pipeline = pipeline(
    "translation",
    model="facebook/nllb-200-distilled-600M"
)

def english_to_dzongkha(text, dictionary):
    return dictionary.get(text, "[Translation unavailable]")

def dzongkha_to_english(text, dictionary):
    reversed_dict = {v: k for k, v in dictionary.items()}
    return reversed_dict.get(text, None)

def translate_dzongkha_to_english(text, dictionary, translator):
    translation = dzongkha_to_english(text, dictionary)
    if translation:
        return translation

    result = translator(
        text,
        src_lang="bod_Tibt",
        tgt_lang="eng_Latn"
    )
    translated_text = result[0]["translation_text"]

    if any(word in translated_text.lower() for word in ["thou", "thy", "shalt"]):
        return "[Translation unavailable]"

    return translated_text

def translate_english_to_dzongkha(text, dictionary, translator_pipeline):
    """
    Translate an English string to Dzongkha using:
    - Dictionary lookup first
    - NLLB-200 as fallback
    """
    words = text.strip().lower().split()
    translated = []

    for word in words:
        dz = dictionary.get(word)
        if dz:
            translated.append(dz)
        else:
            # fallback to NLLB
            try:
                result = translator_pipeline(
                    text=word,
                    src_lang="eng_Latn",
                    tgt_lang="dzo_Dzongkha"
                )
                translated_word = result[0]["translation_text"]
                translated.append(translated_word)
            except Exception:
                translated.append("[unknown]")

    return " ".join(translated)
