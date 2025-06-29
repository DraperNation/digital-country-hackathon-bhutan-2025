import logging
import os
from datetime import datetime


class SingletonLogger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SingletonLogger, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._initialized = True
            self._logger = None

    def get_logger(self):
        if self._logger is None:
            self._logger = self._setup_logger()
        return self._logger

    def _setup_logger(self):
        # Create logs directory if it doesn't exist
        os.makedirs("logs", exist_ok=True)

        # Create logger
        logger = logging.getLogger("ebutan_gemini_chatbot")
        logger.setLevel(logging.DEBUG)

        # Create formatters
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        # Create file handler
        current_date = datetime.now().strftime("%Y-%m-%d")
        file_handler = logging.FileHandler(f"logs/ebutan_gemini_chatbot_{current_date}.log")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)

        # Create console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)

        # Add handlers to logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger 