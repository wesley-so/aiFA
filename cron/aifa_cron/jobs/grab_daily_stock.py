from os import getenv

import requests

from ..database import init_database, insert_stock

init_database()

grab_list = [
    "AAPL",
    "AMZN",
    "BABA",
    "CSCO",
    "GOOG",
    "META",
    "MSFT",
    "NVDA",
    "ORCL",
    "TSLA",
]


def grab_daily_stock(symbol: str):
    api_key = getenv("FMP_API_KEY")
    r = requests.get(
        f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{symbol}?apikey={api_key}"
    )
    price_list = r.json()
    for i in price_list:
        i["symbol"] = symbol
    print(f"{symbol} stock data grabbed!!!")
    insert_stock(price_list)


if __name__ == "__main__":
    for i in grab_list:
        try:
            grab_daily_stock(i)
        except:
            pass
