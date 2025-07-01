-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS market_data;

-- Create new options table with structured columns
CREATE TABLE IF NOT EXISTS market_data.options (
    -- Primary identifier
    symbol VARCHAR(50) PRIMARY KEY,
    
    -- Timestamp fields
    timestamp BIGINT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Contract information
    contract_type VARCHAR(20) NOT NULL,  -- 'put_options', 'call_options', 'perpetual_futures'
    underlying_asset_symbol VARCHAR(20) NOT NULL,
    description TEXT,
    product_id INTEGER,
    
    -- Price information
    mark_price NUMERIC(20, 8),
    spot_price NUMERIC(20, 8),
    strike_price NUMERIC(20, 8),  -- NULL for futures
    tick_size NUMERIC(20, 8),
    
    -- OHLC data
    open NUMERIC(20, 8),
    high NUMERIC(20, 8),
    low NUMERIC(20, 8),
    close NUMERIC(20, 8),
    
    -- Volume and open interest
    volume NUMERIC(20, 8),
    turnover NUMERIC(20, 8),
    turnover_usd NUMERIC(20, 8),
    turnover_symbol VARCHAR(50),
    oi NUMERIC(20, 8),
    oi_contracts INTEGER,
    oi_value NUMERIC(20, 8),
    oi_value_usd NUMERIC(20, 8),
    oi_value_symbol VARCHAR(50),
    oi_change_usd_6h NUMERIC(20, 8),
    
    -- Quotes
    best_bid NUMERIC(20, 8),
    best_ask NUMERIC(20, 8),
    bid_size NUMERIC(20, 8),
    ask_size NUMERIC(20, 8),
    bid_iv NUMERIC(16, 8),
    ask_iv NUMERIC(16, 8),
    mark_iv NUMERIC(16, 8),
    impact_mid_price NUMERIC(20, 8),
    
    -- Greeks (NULL for futures)
    delta NUMERIC(16, 8),
    gamma NUMERIC(16, 8),
    theta NUMERIC(16, 8),
    vega NUMERIC(16, 8),
    rho NUMERIC(16, 8),
    
    -- Futures specific fields
    mark_basis NUMERIC(20, 8),  -- NULL for options
    funding_rate NUMERIC(16, 8),  -- NULL for options
    
    -- Other fields
    size INTEGER,
    initial_margin NUMERIC(20, 8),
    mark_change_24h NUMERIC(20, 8),
    
    -- Price band
    upper_limit NUMERIC(20, 8),
    lower_limit NUMERIC(20, 8)
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_options_symbol ON market_data.options(symbol);

-- Comment on table
COMMENT ON TABLE market_data.options IS 'Stores options and futures data with structured columns'; 