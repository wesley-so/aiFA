import pandas as pd
from pymongo import ASCENDING

from ..database import stock_collection


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
    print(f"Stock data shape: {stock_data.shape}")
    stock_data["date"] = pd.to_datetime(stock_data["date"])
    return stock_data
