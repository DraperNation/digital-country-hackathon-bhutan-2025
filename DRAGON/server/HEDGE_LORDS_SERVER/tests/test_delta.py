import asyncio
import json

from datetime import date, timedelta, datetime
from services.common.core.logging import logger
from services.common.exchanges.delta import DeltaExchange
from services.common.types.models import TickerData, OptionsStream
from services.common.db.database import get_db_session
from decimal import Decimal


async def store_ticker_data(message, session):
    try:
        data = json.loads(message)
        logger.debug(f"Received raw message: {data}")

        if data.get("type") == "v2/ticker":
            # Check if timestamp exists and is not None
            timestamp = data.get("timestamp")
            if timestamp is None:
                logger.error(
                    f"Received ticker data without timestamp. Full payload: {data}"
                )
                return

            ticker_data = TickerData(
                timestamp=datetime.fromtimestamp(float(timestamp) / 1000),
                symbol=data.get("symbol", ""),
                contract_type=data.get("contract_type", ""),
                mark_price=Decimal(str(data.get("mark_price", 0))),
                spot_price=Decimal(str(data.get("spot_price", 0)))
                if data.get("spot_price") is not None
                else None,
                best_bid=Decimal(str(data.get("best_bid", 0)))
                if data.get("best_bid") is not None
                else None,
                best_ask=Decimal(str(data.get("best_ask", 0)))
                if data.get("best_ask") is not None
                else None,
                mark_iv=Decimal(str(data.get("mark_iv", 0)))
                if data.get("mark_iv") is not None
                else None,
                turnover_usd=Decimal(str(data.get("turnover_usd", 0)))
                if data.get("turnover_usd") is not None
                else None,
                open_interest=Decimal(str(data.get("open_interest", 0)))
                if data.get("open_interest") is not None
                else None,
                oi_contracts=data.get("oi_contracts"),
                volume=Decimal(str(data.get("volume", 0)))
                if data.get("volume") is not None
                else None,
            )

            db_ticker = OptionsStream(
                timestamp=ticker_data.timestamp,
                symbol=ticker_data.symbol,
                contract_type=ticker_data.contract_type,
                mark_price=ticker_data.mark_price,
                spot_price=ticker_data.spot_price,
                best_bid=ticker_data.best_bid,
                best_ask=ticker_data.best_ask,
                mark_iv=ticker_data.mark_iv,
                turnover_usd=ticker_data.turnover_usd,
                open_interest=ticker_data.open_interest,
                oi_contracts=ticker_data.oi_contracts,
                volume=ticker_data.volume,
            )

            session.add(db_ticker)
            await session.commit()
            logger.debug(f"Stored ticker data for {ticker_data.symbol}")
    except Exception as e:
        logger.error(f"Error storing ticker data: {e}")
        await session.rollback()


async def historical_message_callback(message):
    logger.debug(f"Received message: {message}")


async def test_historical_data():
    # Create instance
    delta = DeltaExchange(historical_message_callback)

    # Calculate dates
    end_date = datetime.now()
    start_date = end_date - timedelta(days=10)

    # Get historical data
    logger.info(f"Fetching historical data from {start_date} to {end_date}")
    df = await delta.get_historical_data(
        coin="BTCUSD",
        resolution="1d",
        start_date=start_date,
        end_date=end_date,
    )

    # Log the data
    if not df.empty:
        logger.info(f"Retrieved {len(df)} candles")
        logger.debug(f"Data sample:\n{df.head()}")
        logger.debug(f"Columns: {df.columns.tolist()}")
    else:
        logger.error("No data retrieved")


async def test_websocket():
    async with get_db_session() as session:
        # Create message callback that stores data
        async def message_callback(message):
            await store_ticker_data(message, session)
            logger.debug(f"Received message: {message}")

        # Create instance with our callback
        delta = DeltaExchange(message_callback)

        # Connect to websocket
        await delta.connect()

        # Subscribe to BTCUSD for tomorrow
        tomorrow = date.today() + timedelta(days=1)
        await delta.subscribe("BTCUSD", tomorrow)

        # Wait for 3 seconds while collecting data
        logger.info("Collecting data for 3 seconds...")
        await asyncio.sleep(3)

        # Cleanup
        logger.info("Cleaning up...")
        await delta.unsubscribe()
        await delta.disconnect()


if __name__ == "__main__":
    # Run both tests
    # asyncio.run(test_historical_data())
    asyncio.run(test_websocket())
