import numpy as np
import pandas as pd
from services.common.core.logging import simulator_logger as logger


def simulate(prices: pd.Series, candles: int, iterations: int):
    returns = prices.pct_change().dropna()
    log_returns = np.log(1 + returns)

    mu = log_returns.mean()
    var = log_returns.var()
    stdev = log_returns.std()
    drift = mu - (0.5 * var * (prices.shape[0] - 2) / prices.shape[0])

    Z = np.random.laplace(size=(candles, iterations))
    daily_returns = np.exp(drift + stdev * Z)

    price_paths = np.zeros((candles, iterations))
    price_paths[0] = prices.iloc[-1]
    for t in range(1, candles):
        price_paths[t] = price_paths[t - 1] * daily_returns[t]

    logger.info("Entered 2")
    return price_paths


def get_mean_price(prices: pd.Series, candles: int, iterations: int, freq: str):
    predicted_time = prices.index[-1] + (candles * pd.Timedelta(freq))
    if prices.index[-1].time() != pd.to_datetime("12:00:00").time():
        return pd.Series({predicted_time: np.nan})
    simulations = simulate(prices, candles, iterations)
    predicted_price = np.mean(simulations[-1])
    return pd.Series({predicted_time: predicted_price})


def get_upper_price(
    prices: pd.Series, candles: int, iterations: int, freq: str
) -> pd.DataFrame:
    predicted_time = prices.index[-1] + (candles * pd.Timedelta(freq))
    if prices.index[-1].time() != pd.to_datetime("12:00:00").time():
        return pd.Series({predicted_time: np.nan})
    simulations = simulate(prices, candles, iterations)
    predicted_price = np.percentile(simulations[-1], 95)
    return pd.Series({predicted_time: predicted_price})


def get_lower_price(
    prices: pd.Series, candles: int, iterations: int, freq: str
) -> pd.DataFrame:
    predicted_time = prices.index[-1] + (candles * pd.Timedelta(freq))
    if prices.index[-1].time() != pd.to_datetime("12:00:00").time():
        return pd.Series({predicted_time: np.nan})
    simulations = simulate(prices, candles, iterations)
    predicted_price = np.percentile(simulations[-1], 5)
    return pd.Series({predicted_time: predicted_price})
