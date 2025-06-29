#!/usr/bin/env python3
"""
Bhutan Translation Service
Translates between English and Dzongkha (Bhutanese) using Google Cloud Translate API
"""

import os
from google.cloud import translate_v3 as translate
from dotenv import load_dotenv


class BhutanTranslator:
    def __init__(self):
        load_dotenv()
        self.project_id = 'bhutan-464321'
        if not self.project_id:
            raise ValueError("GOOGLE_CLOUD_PROJECT_ID not found in environment variables")
        
        self.client = translate.TranslationServiceClient()
        self.parent = f"projects/{self.project_id}/locations/global"
    
    def translate_english_to_dzongkha(self, text: str) -> str:
        """Translate English text to Dzongkha"""
        response = self.client.translate_text(
            request={
                "parent": self.parent,
                "contents": [text],
                "mime_type": "text/plain",
                "source_language_code": "en",
                "target_language_code": "dz",
            }
        )
        return response.translations[0].translated_text
    
    def translate_dzongkha_to_english(self, text: str) -> str:
        """Translate Dzongkha text to English"""
        response = self.client.translate_text(
            request={
                "parent": self.parent,
                "contents": [text],
                "mime_type": "text/plain",
                "source_language_code": "dz",
                "target_language_code": "en",
            }
        )
        return response.translations[0].translated_text


if __name__ == "__main__":
    # Basic usage example
    translator = BhutanTranslator()
    
    # Translate English to Dzongkha
    english_text = "Hello, welcome to Bhutan!"
    dzongkha_text = translator.translate_english_to_dzongkha(english_text)
    print(f"EN: {english_text}")
    print(f"DZ: {dzongkha_text}")
    
    # Translate Dzongkha to English
    english_back = translator.translate_dzongkha_to_english(dzongkha_text)
    print(f"Back to EN: {english_back}") 