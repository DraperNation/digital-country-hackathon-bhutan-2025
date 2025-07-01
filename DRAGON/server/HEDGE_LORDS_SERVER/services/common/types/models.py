from typing import Optional, Union
from decimal import Decimal
from pydantic import BaseModel
from sqlalchemy import (
    Column,
    String,
    Integer,
    TIMESTAMP,
    Numeric,
    Text,
    BigInteger,
)
from datetime import date as Date
from sqlalchemy.sql import func
from services.common.db.database import Base
from services.common.types.enums import Resolution
from services.common.types.enums import Direction, OptionsTypes, FuturesTypes


class PriceBand(BaseModel):
    lower_limit: Optional[Decimal] = None
    upper_limit: Optional[Decimal] = None


class Greeks(BaseModel):
    delta: Optional[Decimal] = None
    gamma: Optional[Decimal] = None
    rho: Optional[Decimal] = None
    spot: Optional[Decimal] = None
    theta: Optional[Decimal] = None
    vega: Optional[Decimal] = None


class Quotes(BaseModel):
    ask_iv: Optional[Decimal] = None
    ask_size: Optional[Decimal] = None
    best_ask: Optional[Decimal] = None
    best_bid: Optional[Decimal] = None
    bid_iv: Optional[Decimal] = None
    bid_size: Optional[Decimal] = None
    impact_mid_price: Optional[Decimal] = None
    mark_iv: Optional[Decimal] = None


class BaseTicker(BaseModel):
    """Base model for all ticker types"""

    symbol: str
    timestamp: int
    type: str
    contract_type: str
    underlying_asset_symbol: str

    # Price information
    mark_price: Decimal
    spot_price: Optional[Decimal] = None
    tick_size: Optional[Decimal] = None

    # OHLC data - Make these optional
    open: Optional[Decimal] = None
    high: Optional[Decimal] = None
    low: Optional[Decimal] = None
    close: Optional[Decimal] = None

    # Volume and open interest - Make these optional
    volume: Optional[Decimal] = None
    turnover: Optional[Decimal] = None
    turnover_usd: Optional[Decimal] = None
    turnover_symbol: Optional[str] = None
    oi: Optional[Decimal] = None
    oi_contracts: Optional[int] = None
    oi_value: Optional[Decimal] = None
    oi_value_usd: Optional[Decimal] = None
    oi_value_symbol: Optional[str] = None
    oi_change_usd_6h: Optional[Decimal] = None

    # Other fields
    size: Optional[int] = None
    initial_margin: Optional[Decimal] = None
    description: Optional[str] = None
    product_id: Optional[int] = None
    mark_change_24h: Optional[Decimal] = None
    price_band: Optional[PriceBand] = None
    tags: list[str] = []

    # Optional nested objects
    quotes: Optional[Quotes] = None


class OptionsTicker(BaseTicker):
    """Model for options data"""

    contract_type: OptionsTypes
    strike_price: Decimal
    greeks: Optional[Greeks] = None


class FuturesTicker(BaseTicker):
    """Model for futures data"""

    contract_type: FuturesTypes
    mark_basis: Decimal
    funding_rate: Decimal
    greeks: None = None


class TickerResponse(BaseModel):
    """Response model for ticker data"""

    symbol: str
    timestamp: int
    contract_type: str
    mark_price: Decimal

    class Config:
        orm_mode = True


class SimpleTicker(BaseModel):
    symbol: str
    contract_type: str
    strike_price: Optional[float]
    best_bid: Optional[float]
    best_ask: Optional[float]
    spot_price: Optional[float]
    expiry_date: Optional[str]

    class Config:
        arbitrary_types_allowed = True


class SelectedTicker(SimpleTicker):
    position: Direction


class DataPoints(BaseModel):
    x: list[float]
    y: list[float]


# Union type for handling both options and futures
TickerData = Union[OptionsTicker, FuturesTicker]


class HistoricalData(Base):
    __tablename__ = "historical_data"
    __table_args__ = {"schema": "market_data"}

    symbol = Column(String(10), nullable=False)
    time = Column(TIMESTAMP(timezone=True), primary_key=True)
    open = Column(Numeric(20, 8))
    high = Column(Numeric(20, 8))
    low = Column(Numeric(20, 8))
    close = Column(Numeric(20, 8))
    volume = Column(Numeric(20, 8))


class Options(Base):
    """SQLAlchemy model for the market_data.options table"""

    __tablename__ = "options"
    __table_args__ = {"schema": "market_data"}

    # Primary identifier
    symbol = Column(String(50), primary_key=True)

    # Timestamp fields
    timestamp = Column(BigInteger, nullable=False)
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Contract information
    contract_type = Column(String(20), nullable=False)
    underlying_asset_symbol = Column(String(20), nullable=False)
    description = Column(Text)
    product_id = Column(Integer)

    # Price information
    mark_price = Column(Numeric(20, 8))
    spot_price = Column(Numeric(20, 8))
    strike_price = Column(Numeric(20, 8))
    tick_size = Column(Numeric(20, 8))

    # OHLC data
    open = Column(Numeric(20, 8))
    high = Column(Numeric(20, 8))
    low = Column(Numeric(20, 8))
    close = Column(Numeric(20, 8))

    # Volume and open interest
    volume = Column(Numeric(20, 8))
    turnover = Column(Numeric(20, 8))
    turnover_usd = Column(Numeric(20, 8))
    turnover_symbol = Column(String(50))
    oi = Column(Numeric(20, 8))
    oi_contracts = Column(Integer)
    oi_value = Column(Numeric(20, 8))
    oi_value_usd = Column(Numeric(20, 8))
    oi_value_symbol = Column(String(50))
    oi_change_usd_6h = Column(Numeric(20, 8))

    # Quotes
    best_bid = Column(Numeric(20, 8))
    best_ask = Column(Numeric(20, 8))
    bid_size = Column(Numeric(20, 8))
    ask_size = Column(Numeric(20, 8))
    bid_iv = Column(Numeric(16, 8))
    ask_iv = Column(Numeric(16, 8))
    mark_iv = Column(Numeric(16, 8))
    impact_mid_price = Column(Numeric(20, 8))

    # Greeks (NULL for futures)
    delta = Column(Numeric(16, 8))
    gamma = Column(Numeric(16, 8))
    theta = Column(Numeric(16, 8))
    vega = Column(Numeric(16, 8))
    rho = Column(Numeric(16, 8))

    # Futures specific fields
    mark_basis = Column(Numeric(20, 8))
    funding_rate = Column(Numeric(16, 8))

    # Other fields
    size = Column(Integer)
    initial_margin = Column(Numeric(20, 8))
    mark_change_24h = Column(Numeric(20, 8))

    # Price band
    upper_limit = Column(Numeric(20, 8))
    lower_limit = Column(Numeric(20, 8))


class SubscriptionRequest(BaseModel):
    symbol: str
    expiry_date: Date


class LoadOHLCVRequest(BaseModel):
    symbol: str
    resolution: Resolution
    lookback_units: int  # e.g., number of lookback units, if 1hr resolution, and 2000 lookback units, it means 2000 hours of lookback


class SimulateRequest(BaseModel):
    symbol: str
    expiry_date: Date
    resolution: Resolution
    iterations: int
