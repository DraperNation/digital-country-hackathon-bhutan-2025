import json
import pandas as pd
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from services.common.db.database import get_db_session
from services.common.core.logging import producer_logger as logger
from services.common.exchanges.delta import DeltaExchange
from decimal import Decimal
from typing import Union, Any
from sqlalchemy import select, delete, insert
from services.common.types.models import (
    Options,
    OptionsTicker,
    FuturesTicker,
    HistoricalData,
)
from services.common.types.enums import (
    Resolution,
    ResolutionSeconds,
    OptionsTypes,
    FuturesTypes,
)


class OptionsProducer:
    def __init__(self, api_key: str, api_secret: str, ws_url: str, api_url: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.ws_url = ws_url
        self.api_url = api_url
        # Create instance of DeltaExchange that will use our message handler
        self.exchange = None

    async def message_handler(self, message: str) -> None:
        """Handle incoming websocket messages"""
        try:
            logger.debug(
                f"PRODUCER: Received message: {message[:100]}..."
            )  # Print first 100 chars
            async with get_db_session() as db:
                try:
                    data = json.loads(message)
                    logger.debug(f"PRODUCER: Parsed message type: {data.get('type')}")
                    await self.write_to_db(data, db)
                except json.JSONDecodeError as e:
                    logger.error(
                        f"PRODUCER: JSON decode error: {e}, message: {message[:100]}..."
                    )
        except Exception as e:
            logger.error(f"PRODUCER: Error processing message: {e}")

    async def write_to_db(self, message: dict, db: AsyncSession) -> None:
        """Write message to database using structured models"""
        logger.debug(f"PRODUCER: Writing to db {message.get('type')}")

        # Only process ticker messages
        if message.get("type") != "v2/ticker":
            logger.warning(f"PRODUCER: Skipping message type: {message.get('type')}")
            return

        symbol = message.get("symbol")
        if not symbol:
            logger.warning(f"PRODUCER: Missing symbol: {message}")
            return

        try:
            # Convert string values to appropriate types
            self.prepare_numeric_values(message)

            # Add default values for required fields if missing
            required_fields = [
                "open",
                "high",
                "low",
                "close",
                "volume",
                "turnover",
                "turnover_usd",
                "size",
                "product_id",
                "mark_change_24h",
            ]
            for field in required_fields:
                if field not in message:
                    message[field] = None

            # Ensure price_band exists
            if "price_band" not in message:
                message["price_band"] = {"lower_limit": None, "upper_limit": None}

            contract_type = message.get("contract_type")
            if any(contract_type == member.value for member in OptionsTypes):
                # This is an option
                ticker_data = OptionsTicker(**message)
            elif any(contract_type == member.value for member in FuturesTypes):
                # This is a future
                ticker_data = FuturesTicker(**message)
            else:
                logger.warning(f"PRODUCER: Unknown contract type: {contract_type}")
                return

            await self.save_ticker_to_db(ticker_data, db)

            logger.info(f"PRODUCER: Saved data for symbol: {symbol}")
        except Exception as e:
            logger.error(
                f"PRODUCER: Error writing to database: {e}, message: {message}"
            )
            await db.rollback()

    async def start_streaming(self, symbol: str, expiry_date: date):
        """Start streaming data for given symbol and expiry"""
        logger.info(
            f"PRODUCER: Starting streaming for {symbol} with expiry {expiry_date}"
        )
        await self.stop_streaming()

        # Clear the database table before starting new stream
        await self.clear_database()

        # Create DeltaExchange instance with our message handler
        self.exchange = DeltaExchange(self.message_handler)
        await self.exchange.connect()

        # Subscribe to the symbol with expiry date
        await self.exchange.subscribe(symbol, expiry_date)
        logger.info(f"PRODUCER: Successfully started streaming for {symbol}")

    async def stop_streaming(self):
        """Stop current streaming session"""
        if self.exchange:
            # Unsubscribe from current feed
            await self.exchange.unsubscribe()
            # Disconnect from websocket
            await self.exchange.disconnect()
            logger.info("PRODUCER: Streaming stopped successfully")

    async def load_ohlcv_data(
        self,
        symbol: str,
        resolution: Resolution,
        lookback_units: int,
        db: AsyncSession,
        request_split: int = 1000,
    ) -> None:
        """Load OHLCV data from Delta Exchange API"""
        if self.exchange is None:
            logger.error("PRODUCER: DeltaExchange instance is not initialized")
            return

        try:
            requests = self.calculate_requests(
                symbol, resolution, lookback_units, request_split
            )
            dfs: list[pd.DataFrame] = []
            for request in requests:
                dfs.append(
                    await self.exchange.get_historical_data(
                        coin=request["symbol"],
                        resolution=request["resolution"],
                        start_date=request["start_date"],
                        end_date=request["end_date"],
                        set_index=True,
                    )
                )
            df = (
                pd.concat(dfs, ignore_index=False)
                .sort_index(ascending=True)
                .reset_index(drop=False)
            )
            delete_stmt = delete(HistoricalData)  # No WHERE clause = delete all
            await db.execute(delete_stmt)
            if not df.empty:
                records_to_insert = df[
                    ["symbol", "time", "open", "high", "low", "close", "volume"]
                ].to_dict(orient="records")
                insert_stmt = insert(HistoricalData).values(records_to_insert)
                await db.execute(insert_stmt)
            await db.commit()

        except Exception as e:
            logger.error(f"PRODUCER: Error loading OHLCV data: {e}")

    # HELPER METHODS
    @staticmethod
    def calculate_requests(
        symbol: str, resolution: Resolution, lookback_units: int, request_split: int
    ) -> list[dict[str, Any]]:
        """Calculate requests for loading historical data"""
        resolution_seconds = ResolutionSeconds.__members__.get(resolution.name)
        if resolution_seconds is None:
            raise ValueError(f"Invalid resolution: {resolution}")

        # split into multiple requests if lookback_units > 1000
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(
            seconds=resolution_seconds.value * (lookback_units % request_split)
        )
        requests: list[dict[str, Any]] = [
            {
                "symbol": symbol,
                "resolution": resolution,
                "start_date": start_time,
                "end_date": end_time,
            }
        ]
        if lookback_units > request_split:
            for i in range(0, lookback_units // request_split):
                end_time = start_time
                start_time = end_time - timedelta(
                    seconds=resolution_seconds.value * request_split
                )
                requests.append(
                    {
                        "symbol": symbol,
                        "resolution": resolution,
                        "start_date": start_time,
                        "end_date": end_time,
                    }
                )
        return requests

    async def clear_database(self):
        """Clear all data from the options table"""
        try:
            async with get_db_session() as db:
                await db.execute(text("TRUNCATE TABLE market_data.options"))
                await db.commit()
                logger.info("PRODUCER: Database table cleared successfully")
        except Exception as e:
            logger.error(f"PRODUCER: Error clearing database: {e}")

    def prepare_numeric_values(self, data: dict):
        """Convert string values to appropriate numeric types"""
        # Convert common numeric fields
        for field in [
            "mark_price",
            "spot_price",
            "tick_size",
            "oi",
            "oi_value",
            "oi_value_usd",
            "oi_change_usd_6h",
            "initial_margin",
            "mark_change_24h",
        ]:
            if field in data and isinstance(data[field], str):
                try:
                    data[field] = Decimal(data[field])
                except (ValueError, TypeError):
                    data[field] = None

        # Convert nested price band
        if "price_band" in data and isinstance(data["price_band"], dict):
            for field in ["lower_limit", "upper_limit"]:
                if field in data["price_band"] and isinstance(
                    data["price_band"][field], str
                ):
                    try:
                        data["price_band"][field] = Decimal(data["price_band"][field])
                    except (ValueError, TypeError):
                        data["price_band"][field] = None

        # Convert nested quotes
        if "quotes" in data and data["quotes"]:
            for field in [
                "ask_iv",
                "ask_size",
                "best_ask",
                "best_bid",
                "bid_iv",
                "bid_size",
                "impact_mid_price",
                "mark_iv",
            ]:
                if field in data["quotes"] and isinstance(data["quotes"][field], str):
                    try:
                        data["quotes"][field] = Decimal(data["quotes"][field])
                    except (ValueError, TypeError):
                        data["quotes"][field] = None

        # Convert nested greeks
        if "greeks" in data and data["greeks"]:
            for field in ["delta", "gamma", "rho", "spot", "theta", "vega"]:
                if field in data["greeks"] and isinstance(data["greeks"][field], str):
                    try:
                        data["greeks"][field] = Decimal(data["greeks"][field])
                    except (ValueError, TypeError):
                        data["greeks"][field] = None

        # Convert oi_contracts to integer
        if "oi_contracts" in data and isinstance(data["oi_contracts"], str):
            try:
                data["oi_contracts"] = int(data["oi_contracts"])
            except (ValueError, TypeError):
                data["oi_contracts"] = 0

    async def save_ticker_to_db(
        self, ticker: Union[OptionsTicker, FuturesTicker], db: AsyncSession
    ):
        """Save ticker data to database using SQLAlchemy ORM"""
        # Check if record exists
        stmt = select(Options).where(Options.symbol == ticker.symbol)
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            logger.debug(
                f"PRODUCER: Updating existing record for symbol: {ticker.symbol}"
            )
            # Update existing record
            ticker_dict = ticker.model_dump()
            for key, value in ticker_dict.items():
                # Handle nested objects
                if key == "quotes" and value:
                    # Update quote fields
                    if value.get("best_bid") is not None:
                        existing.best_bid = value.get("best_bid")
                    if value.get("best_ask") is not None:
                        existing.best_ask = value.get("best_ask")
                    if value.get("bid_size") is not None:
                        existing.bid_size = value.get("bid_size")
                    if value.get("ask_size") is not None:
                        existing.ask_size = value.get("ask_size")
                    if value.get("bid_iv") is not None:
                        existing.bid_iv = value.get("bid_iv")
                    if value.get("ask_iv") is not None:
                        existing.ask_iv = value.get("ask_iv")
                    if value.get("mark_iv") is not None:
                        existing.mark_iv = value.get("mark_iv")
                    if value.get("impact_mid_price") is not None:
                        existing.impact_mid_price = value.get("impact_mid_price")
                elif key == "greeks" and value:
                    # Update greek fields
                    if value.get("delta") is not None:
                        existing.delta = value.get("delta")
                    if value.get("gamma") is not None:
                        existing.gamma = value.get("gamma")
                    if value.get("theta") is not None:
                        existing.theta = value.get("theta")
                    if value.get("vega") is not None:
                        existing.vega = value.get("vega")
                    if value.get("rho") is not None:
                        existing.rho = value.get("rho")
                elif key == "price_band" and value:
                    # Update price band fields - access as dictionary
                    if value.get("upper_limit") is not None:
                        existing.upper_limit = value.get("upper_limit")
                    if value.get("lower_limit") is not None:
                        existing.lower_limit = value.get("lower_limit")
                elif hasattr(existing, key):
                    # Update regular fields
                    if key == "contract_type":
                        setattr(existing, key, value.value)
                    else:
                        setattr(existing, key, value)

        else:
            logger.debug(f"PRODUCER: Creating new record for symbol: {ticker.symbol}")
            # Create new record
            options = Options(
                # Basic fields
                symbol=ticker.symbol,
                timestamp=ticker.timestamp,
                contract_type=ticker.contract_type.value,
                underlying_asset_symbol=ticker.underlying_asset_symbol,
                description=ticker.description,
                product_id=ticker.product_id,
                # Price information
                mark_price=ticker.mark_price,
                spot_price=ticker.spot_price,
                tick_size=ticker.tick_size,
                # OHLC data
                open=ticker.open,
                high=ticker.high,
                low=ticker.low,
                close=ticker.close,
                # Volume and open interest
                volume=ticker.volume,
                turnover=ticker.turnover,
                turnover_usd=ticker.turnover_usd,
                turnover_symbol=ticker.turnover_symbol,
                oi=ticker.oi,
                oi_contracts=ticker.oi_contracts,
                oi_value=ticker.oi_value,
                oi_value_usd=ticker.oi_value_usd,
                oi_value_symbol=ticker.oi_value_symbol,
                oi_change_usd_6h=ticker.oi_change_usd_6h,
                # Other fields
                size=ticker.size,
                initial_margin=ticker.initial_margin,
                mark_change_24h=ticker.mark_change_24h,
            )

            # Handle option-specific fields
            if isinstance(ticker, OptionsTicker) and ticker.strike_price:
                options.strike_price = ticker.strike_price
                options.contract_type = ticker.contract_type.value

            # Handle futures-specific fields
            if isinstance(ticker, FuturesTicker):
                options.mark_basis = ticker.mark_basis
                options.funding_rate = ticker.funding_rate
                options.contract_type = ticker.contract_type.value

            # Handle quotes - access as object for new records
            if ticker.quotes:
                options.best_bid = ticker.quotes.best_bid
                options.best_ask = ticker.quotes.best_ask
                options.bid_size = ticker.quotes.bid_size
                options.ask_size = ticker.quotes.ask_size
                options.bid_iv = ticker.quotes.bid_iv
                options.ask_iv = ticker.quotes.ask_iv
                options.mark_iv = ticker.quotes.mark_iv
                options.impact_mid_price = ticker.quotes.impact_mid_price
                options.contract_type = ticker.contract_type.value

            # Handle greeks - access as object for new records
            if hasattr(ticker, "greeks") and ticker.greeks:
                options.delta = ticker.greeks.delta
                options.gamma = ticker.greeks.gamma
                options.theta = ticker.greeks.theta
                options.vega = ticker.greeks.vega
                options.rho = ticker.greeks.rho

            # Handle price band - access as object for new records
            if ticker.price_band:
                options.upper_limit = ticker.price_band.upper_limit
                options.lower_limit = ticker.price_band.lower_limit

            db.add(options)

        await db.commit()
