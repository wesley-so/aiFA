from os import getenv

import requests

from aifa.dependencies.session import get_session_token

required_cols = ["date", "open", "high", "low", "close", "volume"]


async def grab_daily_ohlcv(symbol: str):
    token = await get_session_token()
    if token:
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
    else:
        return None
from os import getenv
from aifa.dependencies.session import get_session_token

import requests


async def grab_latest_close(symbol: str):
    token = await get_session_token()
    if token:
        api_key = getenv("FMP_API_KEY")
        r = requests.get(
            "https://financialmodelingprep.com/api/v3"
            +f"/quote-short/{symbol}?apikey={api_key}"
        )
        price = r.json()
        close_data = {
            "symbol": price[0]["symbol"],
            "close": price[0]["price"],
            "volume": price[0]["volume"]
        }
        return close_data
    else: 
        return None 

if __name__ == "__main__":
    grab_latest_close("AAPL")
