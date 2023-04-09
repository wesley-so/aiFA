from os import getenv

import requests

from aifa.models.stock import StockModel

required_cols = ["date", "open", "high", "low", "close", "volume"]


def grab_daily_ohlcv(symbol: str):
    api_key = getenv("FMP_API_KEY")
    r = requests.get(
        "https://financialmodelingprep.com/api/v3"
        + f"/historical-price-full/{symbol}?timeseries=1&apikey={api_key}"
    )
    price_list = r.json()
    stock_data = {
        "symbol": price_list["symbol"],
        "date": price_list["historical"][0]["date"],
        "open": price_list["historical"][0]["open"],
        "high": price_list["historical"][0]["high"],
        "low": price_list["historical"][0]["low"],
        "close": price_list["historical"][0]["close"],
        "volume": price_list["historical"][0]["volume"],
    }
    return stock_data
