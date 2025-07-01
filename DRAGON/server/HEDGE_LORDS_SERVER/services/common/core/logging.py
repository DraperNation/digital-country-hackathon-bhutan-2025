import os
import logging
import logging.handlers


def setup_logger(
    logger_name: str = "logger",
    log_file: str = "app.log",
    file_logging_level=logging.DEBUG,
    console_logging_level=logging.WARNING,
) -> logging.Logger:
    logger: logging.Logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)

    # Prevent adding handlers multiple times if function is called again for same logger
    if logger.hasHandlers():
        logger.handlers.clear()

    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.getcwd(), "logs")
    os.makedirs(log_dir, exist_ok=True)

    log_file_path = os.path.join(log_dir, log_file)

    # Create a file handler and console handler
    file_handler = logging.handlers.RotatingFileHandler(
        filename=log_file_path,
        backupCount=4,
        encoding="utf-8",  # Explicitly set encoding
        delay=False,  # Open file immediately
    )
    console_handler = logging.StreamHandler()

    file_handler.setLevel(file_logging_level)
    console_handler.setLevel(console_logging_level)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(filename)s - %(message)s"
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # Add the handlers to the logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    return logger


producer_logger = setup_logger(
    logger_name="producer_logger",
    log_file="producer.log",
    file_logging_level=logging.INFO,
)
consumer_logger = setup_logger(
    logger_name="consumer_logger",
    log_file="consumer.log",
    file_logging_level=logging.INFO,
)
simulator_logger = setup_logger(
    logger_name="simulator_logger",
    log_file="simulator.log",
    file_logging_level=logging.INFO,
)
common_logger = setup_logger(
    logger_name="common_logger", log_file="common.log", file_logging_level=logging.DEBUG
)
