import os

from pathlib import Path
from dotenv import load_dotenv
from services.common.core.logging import common_logger as logger

root_dir = Path(__file__).resolve().parent.parent.parent.parent  # Adjust as needed
env_path = root_dir / ".env"
logger.info(f"env_path: {env_path}")

load_dotenv(env_path)

MODE = os.getenv("MODE")

# Add these new JWT configurations
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("REMOTE_DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")


EXCHANGES = {
    "binance": {
        "base_url": "https://api.binance.com",
        "ws_url": "wss://stream.binance.com:9443/ws",
        "coins": ["SOLUSDT", "BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT"],
        "api_key": os.getenv("BINANCE_API_KEY"),
        "api_secret": os.getenv("BINANCE_API_SECRET"),
    },
    "delta_exchange": {
        "base_url": "https://api.india.delta.exchange",
        "ws_url": "wss://socket.india.delta.exchange",
        "coins": ["BTCUSD", "ETHUSD"],
        "api_key": os.getenv("DELTA_API_KEY"),
        "api_secret": os.getenv("DELTA_API_SECRET"),
    },
    "alpaca": {
        "base_url": "https://paper-api.alpaca.markets",
        "ws_url": "wss://paper-api.alpaca.markets/v2/ws",
        "coins": ["BTCUSDT", "ETHUSDT"],
        "api_key": os.getenv("ALPACA_API_KEY"),
        "api_secret": os.getenv("ALPACA_API_SECRET"),
    },
}
