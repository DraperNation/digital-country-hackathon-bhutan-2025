#!/usr/bin/env python3
"""
Test script for Bhutan Translation Service
Tests both directions of translation
"""

from translate_bhutan import BhutanTranslator

def test_translations():
    """Test the translation functionality"""
    try:
        translator = BhutanTranslator()
        
        print("🇧🇹 Testing Bhutan Translation Service")
        print("=" * 40)
        
        # Test English to Dzongkha
        test_phrases_en = [
            "Hello, welcome to Bhutan!",
            "How are you today?",
            "Thank you very much",
            "Digital residency program",
            "Government services online"
        ]
        
        print("\n📝 Testing English to Dzongkha:")
        for phrase in test_phrases_en:
            try:
                result = translator.translate_english_to_dzongkha(phrase)
                print(f"EN: {phrase}")
                print(f"DZ: {result}")
                print("-" * 30)
            except Exception as e:
                print(f"Error translating '{phrase}': {e}")
        
        # Test round-trip translation
        print("\n🔄 Testing Round-Trip Translation:")
        original = "Welcome to digital Bhutan!"
        try:
            dzongkha = translator.translate_english_to_dzongkha(original)
            back_to_english = translator.translate_dzongkha_to_english(dzongkha)
            print(f"Original EN: {original}")
            print(f"To DZ: {dzongkha}")
            print(f"Back to EN: {back_to_english}")
        except Exception as e:
            print(f"Error in round-trip translation: {e}")
        
        print("\n✅ Translation tests completed!")
        
    except ValueError as e:
        print(f"❌ Configuration Error: {e}")
        print("\n🔧 Setup Instructions:")
        print("1. Set GOOGLE_CLOUD_PROJECT_ID environment variable")
        print("2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    test_translations() 