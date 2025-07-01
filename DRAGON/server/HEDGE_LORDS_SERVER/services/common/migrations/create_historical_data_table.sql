-- Create schema if it doesn't exist (assuming you want this table in the same schema)
CREATE SCHEMA IF NOT EXISTS market_data;

-- Create the historical_data table based on the SQLAlchemy schema
CREATE TABLE IF NOT EXISTS market_data.historical_data (
    symbol VARCHAR(10) NOT NULL,
    time TIMESTAMP WITH TIME ZONE PRIMARY KEY, -- Maps to TIMESTAMP(timezone=True), primary_key=True
    open NUMERIC(20, 8),                       -- Maps to Numeric(20, 8)
    high NUMERIC(20, 8),                       -- Maps to Numeric(20, 8)
    low NUMERIC(20, 8),                        -- Maps to Numeric(20, 8)
    close NUMERIC(20, 8),                      -- Maps to Numeric(20, 8)
    volume NUMERIC(20, 8)                      -- Maps to Numeric(20, 8)
);

-- Optional: Add a comment to the table for clarity
COMMENT ON TABLE market_data.historical_data IS 'Stores historical OHLCV data for various symbols.';

-- Optional: Add an index on symbol for faster lookups by symbol
-- (Note: The primary key on 'time' already creates an index on that column)
CREATE INDEX IF NOT EXISTS idx_historical_data_symbol ON market_data.historical_data(symbol);