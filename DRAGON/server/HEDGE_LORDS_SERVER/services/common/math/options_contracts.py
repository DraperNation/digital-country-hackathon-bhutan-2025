import numpy as np
from typing import Literal, Union


def call_payoff(
    prices: Union[float, np.ndarray],  # Accept float or ndarray
    strike: float,
    premium: float,
    direction: Literal[1, -1],
    lot_size: float,
) -> Union[float, np.ndarray]:  # Return type matches input type
    """
    Calculates the payoff for a call option position.

    Args:
        prices: Underlying asset price(s).
        strike: Strike price of the option.
        premium: Premium paid (if direction=1) or received (if direction=-1).
        direction: 1 for a long position (buy), -1 for a short position (sell).
        lot_size: Size of the contract lot.

    Returns:
        Payoff value(s) corresponding to the input price(s).
    """
    # Ensure prices is a NumPy array for consistent vectorized operations
    # This also handles scalar float inputs correctly.
    prices = np.asarray(prices)

    # Calculate intrinsic value (for a long position)
    intrinsic_value = np.maximum(0, prices - strike)

    # Calculate payoff for a long position per unit
    long_payoff_per_unit = intrinsic_value - premium

    # Apply direction (long/short) and lot size
    total_payoff = direction * lot_size * long_payoff_per_unit

    # If the original input was a scalar float, return a scalar float
    if np.isscalar(prices):
        # Ensure we return a standard Python float if input was scalar
        return total_payoff.item()
    else:
        return total_payoff


def put_payoff(
    prices: Union[float, np.ndarray],  # Accept float or ndarray
    strike: float,
    premium: float,
    direction: Literal[1, -1],
    lot_size: float,
) -> Union[float, np.ndarray]:  # Return type matches input type
    """
    Calculates the payoff for a put option position.

    Args:
        prices: Underlying asset price(s).
        strike: Strike price of the option.
        premium: Premium paid (if direction=1) or received (if direction=-1).
        direction: 1 for a long position (buy), -1 for a short position (sell).
        lot_size: Size of the contract lot.

    Returns:
        Payoff value(s) corresponding to the input price(s).
    """
    # Ensure prices is a NumPy array for consistent vectorized operations
    prices = np.asarray(prices)

    # Calculate intrinsic value (for a long position)
    intrinsic_value = np.maximum(0, strike - prices)

    # Calculate payoff for a long position per unit
    long_payoff_per_unit = intrinsic_value - premium

    # Apply direction (long/short) and lot size
    total_payoff = direction * lot_size * long_payoff_per_unit

    # If the original input was a scalar float, return a scalar float
    if np.isscalar(prices):
        # Ensure we return a standard Python float if input was scalar
        return total_payoff.item()
    else:
        return total_payoff
