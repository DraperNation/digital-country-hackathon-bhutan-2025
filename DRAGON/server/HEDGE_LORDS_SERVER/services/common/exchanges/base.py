import pandas as pd

from datetime import date as Date
from abc import ABC, abstractmethod


class BaseExchange(ABC):
    def __init__(
        self,
        base_url: str,
        ws_url: str,
        api_key: str,
        api_secret: str,
        on_message_callback: callable,
    ):
        self.base_url = base_url
        self.ws_url = ws_url
        self.api_key = api_key
        self.api_secret = api_secret
        self.on_message_callback = on_message_callback

    @abstractmethod
    async def connect(self) -> None:
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        pass

    @abstractmethod
    async def subscribe(self, coin: str, date: Date) -> None:
        pass

    @abstractmethod
    async def unsubscribe(self) -> None:
        pass

    @property
    @abstractmethod
    async def all_options_contracts(self) -> list[str]:
        pass

    @abstractmethod
    async def filtered_contracts(self, coin: str, date: Date) -> list[str]:
        pass

    @abstractmethod
    async def get_historical_data(
        self, coin: str, resolution: str, start_date: Date, end_date: Date
    ) -> pd.DataFrame:
        pass
