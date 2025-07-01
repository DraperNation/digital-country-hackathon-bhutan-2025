import os
import httpx
import subprocess
import asyncio
import json
import numpy as np
import pandas as pd
from datetime import datetime, date, timezone
from sqlalchemy import select
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.asyncio import AsyncSession
from services.consumer.websocket_manager import manager
from services.common.db.database import get_db_session
from services.common.core.logging import consumer_logger as logger
from services.common.types.models import (
    Options,
    SelectedTicker,
    DataPoints,
    SimulateRequest,
)
from typing import Optional
from decimal import Decimal
from services.common.types.enums import Resolution
from services.common.math.options_contracts import call_payoff, put_payoff


class PayoffDiagramConsumer:
    def __init__(self):
        self.polling_task = None
        self.should_stop = False
        self.selected_contracts = {}
        self.price_range_percentage = 0.1  # Default 10% range for price points
        self.lot_size: float = 1.0  # Default lot size for contracts
        self.num_price_points = 500  # Number of price points to calculate
        self.set_sim_directory()

    async def process_message(self, message: str):
        """Process incoming messages from the client"""
        try:
            data = json.loads(message)
            message_type = data.get("type")

            if message_type == "select_contract":
                contract_symbol = data.get("symbol")
                position = data.get("position", "buy")  # Default to "buy"
                if contract_symbol:
                    self.selected_contracts[contract_symbol] = position
                    logger.info(
                        f"PAYOFF: Added contract {contract_symbol} to selection with position {position}"
                    )

            elif message_type == "deselect_contract":
                contract_symbol = data.get("symbol")
                if contract_symbol and contract_symbol in self.selected_contracts:
                    del self.selected_contracts[contract_symbol]
                    logger.info(
                        f"PAYOFF: Removed contract {contract_symbol} from selection"
                    )

            elif message_type == "set_price_range":
                percentage = data.get("percentage")
                if percentage is not None and 0.01 <= percentage <= 0.5:
                    self.price_range_percentage = percentage
                    logger.info(
                        f"PAYOFF: Updated price range percentage to {percentage}"
                    )

            elif message_type == "set_lot_size":
                lot_size = data.get("lot_size")
                if lot_size is not None and lot_size > 0:
                    self.lot_size = lot_size
                    logger.info(f"PAYOFF: Updated lot size to {lot_size}")

            elif message_type == "clear_selection":
                self.selected_contracts.clear()
                logger.info("PAYOFF: Cleared all selected contracts")

            # Return a confirmation message with the current state.
            return {
                "type": "confirmation",
                "selected_contracts": {
                    k: v for k, v in self.selected_contracts.items()
                },
                "price_range_percentage": self.price_range_percentage,
            }

        except json.JSONDecodeError:
            logger.error(f"PAYOFF: Received invalid JSON: {message}")
        except Exception as e:
            logger.error(f"PAYOFF: Error processing message: {e}")
            logger.exception(e)

        return None

    async def get_monte_carlo(
        self,
        symbol: str,
        expiry_date: date,
        resolution: Resolution,
        iterations: int = 10000,
    ) -> pd.DataFrame | None:
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
        stored_sims = self.get_stored_sims(sim_file_path)

        if stored_sims is not None:
            logger.info(
                f"Using cached Monte Carlo simulation for symbol {symbol}, expiry {expiry_datetime}, resolution {resolution}, iterations {iterations}"
            )
            return stored_sims

        else:
            try:
                batch_file_name = "run_simulator.bat"
                script_dir = os.path.dirname(os.path.abspath(__file__))
                self.create_sims_json(symbol, expiry_date, resolution, iterations)

                project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
                batch_file_path = os.path.join(project_root, batch_file_name)
                logger.info(project_root)
                result = subprocess.run(
                    [batch_file_path],
                    cwd=project_root,  # Run with project root as current dir
                    check=True,  # Raise CalledProcessError if bat fails
                    capture_output=True,  # Get stdout/stderr
                    text=True,  # Decode as text
                )
                if result.stdout:
                    logger.info(f"Script result: {result.stdout.strip()}")
                if result.stderr:
                    logger.warning(f"Script result: {result.stderr.strip()}")
                df = pd.read_csv(sim_file_path, parse_dates=True, index_col=0)
                return df
            except Exception as e:
                logger.error(f"Error starting Monte Carlo simulation: {e}")
        return None

    async def get_expected_values(
        self,
        symbol: str,
        expiry_date: date,
        resolution: Resolution,
        db: AsyncSession,
        iterations: int = 10000,
    ) -> dict[str, dict[str, float]]:
        """Get expected value for the selected contracts"""
        if not self.selected_contracts:
            logger.warning("No selected contracts to calculate expected value")
            return np.nan

        expected_values = np.array([np.nan])
        try:
            query = select(
                Options.symbol,
                Options.best_bid,
                Options.best_ask,
                Options.spot_price,
                Options.contract_type,
                Options.strike_price,
            ).where(Options.symbol.in_(self.selected_contracts.keys()))

            contracts_table_coro = db.execute(query)
            sims_coro = self.get_monte_carlo(
                symbol, expiry_date, resolution, iterations
            )

            logger.info("Gathering data from database and simulation")
            results = await asyncio.gather(contracts_table_coro, sims_coro)
            contracts_list = results[0].mappings().all()
            contracts_dict = {
                row_map.get("symbol"): {  # Key: Symbol
                    key: float(value) if isinstance(value, Decimal) else value
                    for key, value in row_map.items()  # Iterate through columns (key) and values
                }
                for row_map in contracts_list
                if row_map.get("symbol") is not None  # Iterate through rows
            }

            simulations = results[1]
            final_sims = simulations.iloc[-1, :]
            final_payoffs = self.calculate_final_payoffs(
                symbol, expiry_date, final_sims, contracts_dict
            )
            expected_values = {
                "expected_values": {
                    "mean": float(np.mean(final_payoffs)),
                    "median": float(np.median(final_payoffs)),
                    "max": float(np.max(final_payoffs)),
                    "min": float(np.min(final_payoffs)),
                    "percentile_5": float(np.percentile(final_payoffs, 5)),
                    "percentile_95": float(np.percentile(final_payoffs, 95)),
                },
                "expected_prices": {
                    "mean": float(np.mean(final_sims)),
                    "median": float(np.median(final_sims)),
                    "max": float(np.max(final_sims)),
                    "min": float(np.min(final_sims)),
                    "percentile_5": float(np.percentile(final_sims, 5)),
                    "percentile_95": float(np.percentile(final_sims, 95)),
                },
            }
            logger.info(f"EXPECTED VALUES: {expected_values}")
        except Exception as e:
            logger.error(f"PAYOFF: Error fetching expected value: {e}", stack_info=True)
        finally:
            return expected_values

    def calculate_final_payoffs(
        self, symbol: str, expiry_date: date, sims: np.ndarray, contracts: dict
    ) -> np.ndarray:
        total_payoff = np.zeros_like(sims, dtype=float)
        for contract, position in self.selected_contracts.items():
            # Symbol check
            key_parts = contract.split("-")
            if symbol[:3] != key_parts[1]:
                raise Exception(f"Symbol mismatch {symbol[:3]} != key_parts[1]")
            if expiry_date.strftime("%d%m%y") != key_parts[3]:
                raise Exception(
                    f"Expiry Date mismatch {expiry_date.strftime('%d%m%y')} != {key_parts[3]}"
                )

            cost_or_credit = 0.0
            position_multiplier = 1
            strike = contracts[contract]["strike_price"]
            if position == "buy":
                cost_or_credit = contracts[contract]["best_ask"]
            elif position == "sell":
                cost_or_credit = contracts[contract]["best_bid"]
                position_multiplier = -1
            try:
                if contracts[contract]["contract_type"] == "call_options":
                    contract_payoff = call_payoff(
                        sims, strike, cost_or_credit, position_multiplier, self.lot_size
                    )
                elif contracts[contract]["contract_type"] == "put_options":
                    contract_payoff = put_payoff(
                        sims, strike, cost_or_credit, position_multiplier, self.lot_size
                    )
                total_payoff += contract_payoff
            except Exception as e:
                logger.error(
                    f"Error calculating payoff for contract {contract.symbol}: {e}",
                    exc_info=True,
                )
        return total_payoff

    async def get_selected_contracts_data(
        self, db: AsyncSession
    ) -> list[SelectedTicker]:
        """Get data for the selected contracts from the database"""
        if not self.selected_contracts:
            return []

        try:
            query = select(
                Options.symbol,
                Options.contract_type,
                Options.strike_price,
                Options.best_bid,
                Options.best_ask,
                Options.spot_price,
            ).where(Options.symbol.in_(self.selected_contracts.keys()))

            logger.debug(
                f"QUERY: {query.compile(dialect=postgresql.dialect(), compile_kwargs={'literal_binds': True})}"
            )
            result = await db.execute(query)
            rows = result.all()
            contract_data: list[SelectedTicker] = []
            for row in rows:
                if row.strike_price:
                    contract_data.append(
                        SelectedTicker(
                            symbol=row.symbol,
                            contract_type=row.contract_type.replace("_options", ""),
                            strike_price=float(row.strike_price),
                            best_bid=float(row.best_bid) if row.best_bid else None,
                            best_ask=float(row.best_ask) if row.best_ask else None,
                            spot_price=float(row.spot_price)
                            if row.spot_price
                            else None,
                            expiry_date=self._extract_expiry_date(row.symbol),
                            position=self.selected_contracts.get(row.symbol, "buy"),
                        )
                    )

            logger.debug(
                f"PAYOFF: Retrieved data for {len(self.selected_contracts)} selected contracts"
            )
            contract_data.sort(key=lambda x: x.strike_price)
            return contract_data

        except Exception as e:
            logger.error(f"PAYOFF: Error fetching contract data: {e}")
            logger.exception(e)
            return []

    def _extract_expiry_date(self, symbol: str) -> Optional[str]:
        """Extract expiry date from option symbol if possible"""
        try:
            parts = symbol.split("-")
            if len(parts) >= 4:
                date_part = parts[3]
                if len(date_part) >= 6:
                    day = date_part[:2]
                    month = date_part[2:4]
                    year = date_part[4:6]
                    return f"20{year}-{month}-{day}"  # ISO format
            return None
        except Exception:
            return None

    def calculate_payoff_points(
        self, contracts_data: list[SelectedTicker]
    ) -> DataPoints:
        """Calculate payoff diagram data points for the selected contracts using NumPy"""
        if not contracts_data or len(contracts_data) == 0:
            return DataPoints(x=[], y=[])

        try:
            min_x = contracts_data[0].strike_price * (1 - self.price_range_percentage)
            max_x = contracts_data[-1].strike_price * (1 + self.price_range_percentage)
            x = np.linspace(min_x, max_x, self.num_price_points)
            y = np.zeros_like(x)

            for contract in contracts_data:
                payoff_function = np.zeros_like(x)
                logger.info(contract)
                if contract.contract_type == "call":
                    payoff_function = call_payoff(
                        x,
                        contract.strike_price,
                        contract.best_ask or 0,
                        1 if contract.position.value == "buy" else -1,
                        self.lot_size,
                    )
                elif contract.contract_type == "put":
                    payoff_function = put_payoff(
                        x,
                        contract.strike_price,
                        contract.best_ask or 0,
                        1 if contract.position.value == "buy" else -1,
                        self.lot_size,
                    )
                else:
                    continue
                y += payoff_function

            return DataPoints(x=x.tolist(), y=y.tolist())

        except Exception as e:
            logger.error(f"PAYOFF: Error calculating payoff points: {e}")
            logger.exception(e)
            return {"datapoints": []}

    async def get_current_payoff_data(self):
        """Fetch selected contracts and return calculated payoff data"""
        try:
            async with get_db_session() as session:
                contracts_data = await self.get_selected_contracts_data(session)
                logger.info(f"PAYOFF: Selected contracts: {len(contracts_data)}")

                payoff_data = self.calculate_payoff_points(contracts_data)

                return {
                    "type": "payoff_update",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "data": payoff_data.model_dump(),
                    "selected_contracts": list(self.selected_contracts),
                }

        except Exception as e:
            logger.error(f"PAYOFF: Error while fetching payoff data: {e}")
            logger.exception(e)
            return {"error": "Failed to fetch payoff data"}

    async def start_polling(self):
        """Start polling the database for updates and broadcast updated graph data"""
        logger.info("PAYOFF: Starting database polling")
        self.should_stop = False

        while not self.should_stop:
            try:
                # Only poll if there is an active "trading" connection
                if manager.active_connections.get("trading"):
                    async with get_db_session() as session:
                        contracts_data = await self.get_selected_contracts_data(session)
                        # logger.info(
                        #     f"PAYOFF: Selected contracts: {len(contracts_data)}"
                        # )
                        payoff_data = self.calculate_payoff_points(contracts_data)

                        message = {
                            "type": "payoff_update",
                            "timestamp": int(datetime.now().timestamp() * 1000),
                            "data": payoff_data.model_dump(),
                            "selected_contracts": list(self.selected_contracts),
                        }
                        try:
                            await manager.broadcast(message, "trading")
                            logger.debug("PAYOFF: Sent payoff diagram data to client")
                        except Exception as e:
                            logger.error(f"PAYOFF: Error sending to websocket: {e}")

            except Exception as e:
                logger.error(f"PAYOFF: Error during polling: {e}")
                logger.exception(e)

            await asyncio.sleep(0.5)  # Poll every 0.5 seconds

        logger.info("PAYOFF: Polling stopped")

    async def stop_polling(self):
        """Stop the polling process"""
        logger.info("PAYOFF: Stopping polling")
        self.should_stop = True

    def clear_simulations(self) -> None:
        """Clear all stored simulations."""
        if os.path.exists(self.sim_directory):
            for file in os.listdir(self.sim_directory):
                if file.endswith(".csv"):
                    os.remove(os.path.join(self.sim_directory, file))
            logger.info("PAYOFF: All simulations cleared.")
        else:
            logger.warning("PAYOFF: Simulation directory does not exist.")

    def create_sims_json(
        self,
        symbol: str,
        expiry_date: date,
        resolution: Resolution,
        iterations: int = 10000,
    ) -> bool:
        filename = "simulation_params.json"
        simulations_req_file = os.path.join(self.sim_directory, filename)

        request = {
            "symbol": symbol,
            "expiry_date": expiry_date.strftime("%Y%m%d"),
            "resolution": resolution.value,
            "iterations": iterations,
        }

        try:
            if os.path.exists(simulations_req_file):
                os.remove(simulations_req_file)
            with open(simulations_req_file, "w", encoding="utf-8") as json_file:
                json.dump(request, json_file, ensure_ascii=False, indent=4)
            logger.info("JSON file rewritten")
            return True
        except Exception as e:
            logger.error(f"Error creating new request file: {e}")
            return False

    @staticmethod
    def get_stored_sims(path: str) -> pd.DataFrame | None:
        if os.path.exists(path):
            df = pd.read_csv(path, parse_dates=True, index_col=0)
            df.index = pd.to_datetime(df.index, utc=True)
            if df.empty:
                return None
            else:
                return df

    @staticmethod
    def get_file_name(
        symbol: str, expiry_datetime: datetime, resolution: Resolution, iterations: int
    ) -> str:
        """Generate a file name for the simulation results."""
        return f"sim_{symbol}_{expiry_datetime.strftime('%Y%m%d')}_{resolution.name}_{iterations}.csv"

    def set_sim_directory(self) -> None:
        script_path = os.path.abspath(__file__)
        # Get the directory containing the current file
        script_dir = os.path.dirname(script_path)

        # Navigate up twice from the script's directory and normalize the path
        root_dir = os.path.abspath(os.path.join(script_dir, "..", ".."))
        self.sim_directory = os.path.join(root_dir, "simulations")


# Create a singleton instance for use in the consumer router
payoff_consumer = PayoffDiagramConsumer()
