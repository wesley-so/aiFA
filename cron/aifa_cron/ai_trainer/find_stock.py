import pandas as pd
from pymongo import ASCENDING

from ..database import stock_collection

ohlcv = ["open", "low", "high", "close", "volume"]


def find_stock(symbol: str):
    # Preprocess of stock information
    query = {"symbol": symbol}
    projection = {
        "_id": 0,
        "date": 1,
        "symbol": 1,
        "open": 1,
        "high": 1,
        "low": 1,
        "close": 1,
        "volume": 1,
    }
    data = stock_collection.find(query, projection).sort("date", ASCENDING)
    stock_data = pd.DataFrame(list(data))
    for i in ohlcv:
        stock_data[i] = pd.to_numeric(stock_data[i])
    stock_data["date"] = pd.to_datetime(stock_data["date"])
    print(f"{symbol} stock data shape: {stock_data.shape}")
    return stock_data
