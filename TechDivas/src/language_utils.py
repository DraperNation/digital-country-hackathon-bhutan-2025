from src.translation_utils import translate_dzongkha_to_english, translate_english_to_dzongkha, dzongkha_dict, translator_pipeline

def is_dzongkha(text: str) -> bool:
    """
    Quick detection if text contains Tibetan/Dzongkha characters.
    """
    for char in text:
        if '\u0F00' <= char <= '\u0FFF':
            return True
    return False

def process_user_input(user_message: str, user_language: str = "english") -> str:
    """
    Translate Dzongkha to English if needed.
    """
    if user_language.lower() == "dzongkha" or is_dzongkha(user_message):
        return translate_dzongkha_to_english(
            user_message,
            dzongkha_dict,
            translator_pipeline
        )
    return user_message

def process_bot_response(bot_message: str, user_language: str = "english") -> str:
    """
    Translate bot reply to Dzongkha if user selected Dzongkha.
    """
    if user_language.lower() == "dzongkha":
        return translate_english_to_dzongkha(
            bot_message,
            dzongkha_dict,
            translator_pipeline
        )
    return bot_message
