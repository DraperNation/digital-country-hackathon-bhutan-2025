import json
import httpx
import asyncio
import websockets
import pandas as pd

from datetime import datetime
from datetime import date as Date
from services.common.types.enums import Resolution
from services.common.core.logging import common_logger as logger
from services.common.core.config import EXCHANGES
from services.common.exchanges.base import BaseExchange


class DeltaExchange(BaseExchange):
    def __init__(self, on_message_callback: callable):
        super().__init__(
            base_url=EXCHANGES["delta_exchange"]["base_url"],
            ws_url=EXCHANGES["delta_exchange"]["ws_url"],
            api_key=EXCHANGES["delta_exchange"]["api_key"],
            api_secret=EXCHANGES["delta_exchange"]["api_secret"],
            on_message_callback=on_message_callback,
        )
        self.ws = None

    async def listen(self) -> None:
        try:
            async for message in self.ws:
                await self.on_message_callback(message)
        except Exception as e:
            logger.error(f"Error listening to Delta Exchange: {e}")

    async def connect(self) -> None:
        try:
            self.ws = await websockets.connect(self.ws_url)
            asyncio.create_task(self.listen())
        except Exception as e:
            logger.error(f"Error connecting to Delta Exchange: {e}")

    async def disconnect(self) -> None:
        try:
            await self.ws.close()
        except Exception as e:
            logger.error(f"Error disconnecting from Delta Exchange: {e}")

    async def subscribe(self, coin: str, date: Date) -> None:
        try:
            if not self.ws:
                raise RuntimeError("Not connected to Delta Exchange")

            contracts = await self.filtered_contracts(coin, date)
            logger.info(f"Subscribing to contracts: {contracts}")
            contracts.append(coin)

            message = {
                "type": "subscribe",
                "payload": {
                    "channels": [
                        {
                            "name": "v2/ticker",
                            "symbols": contracts,
                        }
                    ]
                },
            }
            await self.ws.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Error subscribing to Delta Exchange: {e}")

    async def unsubscribe(self) -> None:
        if not self.ws:
            return

        try:
            message = {
                "type": "unsubscribe",
                "payload": {"channels": [{"name": "v2/ticker", "symbols": [""]}]},
            }
            await self.ws.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Error unsubscribing from Delta Exchange: {e}")

    @property
    async def all_options_contracts(self) -> list[str]:
        params = {"contract_types": "call_options,put_options", "states": "live"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v2/products", params=params
                )
                response.raise_for_status()
                data = response.json()

                if data["success"]:
                    return [product["symbol"] for product in data["result"]]
                return []
            except httpx.RequestError as e:
                self.logger.error(f"Delta Exchange API error: {e}")
                return []

    async def filtered_contracts(self, coin: str, date: Date) -> list[str]:
        contracts = await self.all_options_contracts
        return [
            contract
            for contract in contracts
            if (parts := contract.split("-"))
            and len(parts) == 4
            and parts[1] == coin[:3]
            and datetime.strptime(parts[3], "%d%m%y").date() == date
        ]

    async def get_historical_data(
        self,
        coin: str,
        resolution: Resolution,
        start_date: datetime,
        end_date: datetime,
        set_index: bool = False,
    ) -> pd.DataFrame:
        params = {
            "resolution": resolution.value,
            "symbol": coin,
            "start": int(start_date.timestamp()),
            "end": int(end_date.timestamp()),
        }
        df = pd.DataFrame(columns=["open", "high", "low", "close", "volume", "time"])
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v2/history/candles", params=params
                )

                # Check for HTTP errors
                response.raise_for_status()
                data = response.json()
                # Check API-level success indicator
                if data.get("success") and data.get(
                    "result"
                ):  # Use .get for safer access
                    temp_df = pd.DataFrame(data["result"])
                    if temp_df.empty:
                        self.logger.warning(
                            f"Received empty result list for {coin} from API for {resolution} resolution and dates {start_date} to {end_date}."
                        )

                    temp_df["time"] = pd.to_datetime(
                        temp_df["time"], unit="s", utc=True
                    )
                    temp_df["symbol"] = coin
                    df = temp_df
                else:
                    self.logger.warning(
                        f"API call for {coin} did not succeed or returned no result. Response: {data}"
                    )

            except httpx.RequestError as e:
                # Network-level errors (connection, timeout, etc.)
                self.logger.error(f"Delta Exchange API request error for {coin}: {e}")
            except httpx.HTTPStatusError as e:
                # HTTP errors (4xx, 5xx)
                self.logger.error(
                    f"Delta Exchange API HTTP status error for {coin}: {e.response.status_code} - {e.response.text}"
                )
            except Exception as e:
                # Other potential errors (e.g., JSON decoding)
                self.logger.error(
                    f"Unexpected error fetching historical data for {coin}: {e}",
                    exc_info=True,
                )
            finally:
                if set_index and not df.empty and "time" in df.columns:
                    df = df.set_index("time")
                return df
