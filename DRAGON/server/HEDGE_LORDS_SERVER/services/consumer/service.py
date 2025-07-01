import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from services.consumer.websocket_manager import manager
from services.common.db.database import get_db_session
from services.common.core.logging import consumer_logger as logger
from services.common.types.models import Options, SimpleTicker


class OptionsConsumer:
    def __init__(self):
        self.polling_task = None
        self.should_stop = False

    async def get_options_chain(self, db: AsyncSession) -> list[SimpleTicker]:
        """Get simplified options chain data from the database"""
        try:
            # Select only the necessary columns for SimpleTicker
            stmt = select(
                Options.symbol,
                Options.contract_type,
                Options.strike_price,
                Options.best_bid,
                Options.best_ask,
                Options.spot_price,
            )
            result = await db.execute(stmt)
            rows = result.all()

            # Log the actual rows fetched
            logger.info(f"CONSUMER: Fetched {len(rows)} rows from database")

            # Create a list of SimpleTicker objects
            simple_tickers = []

            for row in rows:
                # Extract data for SimpleTicker
                ticker = SimpleTicker(
                    symbol=row.symbol,
                    contract_type=row.contract_type,
                    strike_price=float(row.strike_price)
                    if row.strike_price is not None
                    else None,
                    best_bid=float(row.best_bid) if row.best_bid is not None else None,
                    best_ask=float(row.best_ask) if row.best_ask is not None else None,
                    spot_price=float(row.spot_price)
                    if row.spot_price is not None
                    else None,
                    expiry_date=self._extract_expiry_date(row.symbol),
                )

                simple_tickers.append(ticker)

            logger.debug(
                f"CONSUMER: Created {len(simple_tickers)} SimpleTicker objects"
            )
            return simple_tickers
        except Exception as e:
            logger.error(f"CONSUMER: Error fetching options data: {e}")
            logger.exception(e)
            return []

    def _extract_expiry_date(self, symbol: str) -> str:
        """Extract expiry date from option symbol if possible"""
        try:
            # Assuming format like "C-BTC-75600-010325" where last 6 digits are DDMMYY
            parts = symbol.split("-")
            if len(parts) >= 4:
                date_part = parts[3]
                if len(date_part) >= 6:
                    # Extract DDMMYY format
                    day = date_part[:2]
                    month = date_part[2:4]
                    year = date_part[4:6]
                    return f"20{year}-{month}-{day}"  # Return ISO format
            return None
        except Exception:
            return None

    async def start_polling(self):
        """Start polling the database for updates"""
        logger.info("CONSUMER: Starting database polling")
        self.should_stop = False

        while not self.should_stop:
            try:
                # Only poll if there is an active connection for premiums
                if manager.active_connections.get("premiums"):
                    async with get_db_session() as session:
                        # Get options chain data
                        options_chain = await self.get_options_chain(session)

                        # Prepare data to send
                        data_to_send = [ticker.dict() for ticker in options_chain]
                        message = {
                            "timestamp": int(datetime.now().timestamp() * 1000),
                            "purpose": "prices",
                            "options_chain": data_to_send,
                        }

                        # Send data to the premiums connection
                        try:
                            await manager.broadcast(message, "premiums")
                            logger.debug("CONSUMER: Sent options chain to client")
                        except Exception as e:
                            logger.error(f"CONSUMER: Error sending to websocket: {e}")
                            await manager.disconnect("premiums")

            except Exception as e:
                logger.error(f"CONSUMER: Error during polling: {e}")
                logger.exception(e)

            # Wait before next poll
            await asyncio.sleep(0.5)  # Poll every 0.5 seconds

        logger.info("CONSUMER: Polling stopped")

    async def stop_polling(self):
        """Stop the polling process"""
        logger.info("CONSUMER: Stopping polling")
        self.should_stop = True


# Create a singleton instance
consumer = OptionsConsumer()
