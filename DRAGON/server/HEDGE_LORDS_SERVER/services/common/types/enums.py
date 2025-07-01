from enum import Enum


class Resolution(Enum):
    MINUTE_1 = "1m"
    MINUTE_5 = "5m"
    MINUTE_15 = "15m"
    MINUTE_30 = "30m"
    HOUR_1 = "1h"
    HOUR_2 = "2h"
    HOUR_4 = "4h"
    HOUR_6 = "6h"
    DAY_1 = "1d"
    DAY_7 = "7d"
    DAY_30 = "30d"
    WEEK_1 = "1w"
    WEEK_2 = "2w"


class ResolutionSeconds(Enum):
    MINUTE_1 = 60
    MINUTE_5 = 300
    MINUTE_15 = 900
    MINUTE_30 = 1800
    HOUR_1 = 3600
    HOUR_2 = 7200
    HOUR_4 = 14400
    HOUR_6 = 21600
    DAY_1 = 86400
    DAY_7 = 86400 * 7
    DAY_30 = 86400 * 30
    WEEK_1 = 86400 * 7
    WEEK_2 = 86400 * 14


class Direction(Enum):
    BUY = "buy"
    SELL = "sell"


class NumericalDirection(Enum):
    BUY = 1
    SELL = -1


class OptionsTypes(Enum):
    CALL_OPTIONS = "call_options"
    PUT_OPTIONS = "put_options"


class FuturesTypes(Enum):
    PERPETUAL_FUTURES = "perpetual_futures"
