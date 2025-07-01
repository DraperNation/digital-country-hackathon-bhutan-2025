import os
import json
import pandas as pd
from datetime import date, datetime, timezone, timedelta
from sqlalchemy import create_engine, select
from contextlib import contextmanager
from typing import Generator
from services.common.core.config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
from sqlalchemy.orm import sessionmaker, Session
from services.common.types.enums import Resolution
from services.common.core.logging import simulator_logger as logger
from services.common.types.models import HistoricalData, SimulateRequest
from services.common.types.enums import ResolutionSeconds
from services.common.math.cpu_monte import simulate


class SimulatorService:
    def __init__(self) -> None:
        DATABASE_URL = (
            f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )
        self.engine = create_engine(DATABASE_URL)
        self.sync_session_factory = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        self.set_sim_directory()

    @contextmanager
    def get_sync_db_session(self) -> Generator[Session, None, None]:
        """
        Provide a transactional scope around a series of synchronous database operations.

        This mimics the pattern of the async get_db_session, handling commit,
        rollback, and closing automatically.

        Yields:
            Session: The SQLAlchemy synchronous session object.
        """
        session = self.sync_session_factory()
        try:
            yield session  # Provide the session to the 'with' block
            session.commit()  # Commit if the 'with' block succeeded
        except Exception:
            # logger.error("Exception occurred in sync session, rolling back.", exc_info=True)
            session.rollback()  # Rollback on any exception
            raise  # Re-raise the exception
        finally:
            # logger.debug("Closing sync session.")
            session.close()  # Always close the session

    def mc_simulate(
        self,
        symbol: str,
        expiry_date: date,
        resolution: Resolution,
        iterations: int = 10000,
    ) -> str:
        try:
            expiry_datetime = datetime(
                year=expiry_date.year,
                month=expiry_date.month,
                day=expiry_date.day,
                hour=12,
                minute=0,
                second=0,
                tzinfo=timezone.utc,
            )
            sim_file_name = self.get_file_name(
                symbol, expiry_datetime, resolution, iterations
            )
            sim_file_path = os.path.join(self.sim_directory, sim_file_name)

            prices = self.db_historical_data
            if prices.empty:
                logger.warning(f"No historical data found for symbol {symbol}")
                return None

            resolution_seconds = ResolutionSeconds.__members__.get(resolution.name)
            seconds_to_expiry = (
                expiry_datetime - prices.iloc[-1]["time"]
            ).total_seconds()
            candles = int(seconds_to_expiry / resolution_seconds.value)
            logger.info(prices.iloc[-1]["time"])
            timestamps = pd.date_range(
                start=prices.iloc[-1]["time"],
                end=expiry_datetime,
                freq=timedelta(seconds=resolution_seconds.value),
                inclusive="right",  # Include the end timestamp (expiry_datetime)
            )

            simulations = pd.DataFrame(
                simulate(prices["close"].astype(float), candles, iterations)
            )
            simulations.index = timestamps
            simulations.to_csv(sim_file_path, index=True)

            logger.info(
                f"Monte Carlo simulation completed for symbol {symbol}, expiry {expiry_datetime}, resolution {resolution}"
            )
            return sim_file_path
        except Exception as e:
            logger.error(
                f"Error in simulation for inputs: {symbol}, {expiry_datetime}, {resolution}, ERROR: {e}"
            )

    # helper methods
    @property
    def db_historical_data(self) -> pd.DataFrame:
        """Fetch historical data for a given symbol."""
        prices = pd.DataFrame()
        prices_query = select(HistoricalData.time, HistoricalData.close)

        with self.get_sync_db_session() as session:
            result = session.execute(prices_query)
            all_rows_as_mappings = result.mappings().all()
            if all_rows_as_mappings:
                prices = pd.DataFrame(all_rows_as_mappings)
                prices["time"] = prices["time"].dt.tz_convert(timezone.utc)

        return prices

    @staticmethod
    def get_file_name(
        symbol: str,
        expiry_datetime: datetime,
        resolution: Resolution,
        iterations: int,
    ) -> str:
        """Generate a file name for the simulation results."""
        return f"sim_{symbol}_{expiry_datetime.strftime('%Y%m%d')}_{resolution.name}_{iterations}.csv"

    @property
    def saved_request(self) -> SimulateRequest | None:
        """Read simulation parameters from a JSON file."""
        path = os.path.join(self.sim_directory, "simulation_params.json")
        if not os.path.exists(path):
            logger.warning(f"Simulation parameters file not found: {path}")
            return None
        with open(path, "r") as file:
            data = json.load(file)
            data["expiry_date"] = datetime.strptime(
                data["expiry_date"], "%Y%m%d"
            ).date()
            return SimulateRequest(**data)

    def set_sim_directory(self) -> None:
        script_path = os.path.abspath(__file__)
        # Get the directory containing the current file
        script_dir = os.path.dirname(script_path)

        # Navigate up twice from the script's directory and normalize the path
        root_dir = os.path.abspath(os.path.join(script_dir, "..", ".."))
        self.sim_directory = os.path.join(root_dir, "simulations")


simulator_service = SimulatorService()
request = simulator_service.saved_request
if request:
    simulator_service.mc_simulate(
        request.symbol,
        request.expiry_date,
        request.resolution,
        request.iterations,
    )
else:
    logger.error("No simulation request found.")
