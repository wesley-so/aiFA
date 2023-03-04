from os import getenv

import requests

from ..database import init_database, insert_stock

init_database()


def grab_daily_stock(symbol: str):
    api_key = getenv("FMP_API_KEY")
    r = requests.get(
        f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{symbol}?apikey={api_key}"
    )
    price_list = r.json()
    for i in price_list:
        i["symbol"] = symbol
    insert_stock(price_list)


if __name__ == "__main__":
    # grab_daily_stock("AAPL")
    grab_daily_stock("MSFT")
    # grab_daily_stock("GOOG")
    # grab_daily_stock("AMZN")
    # grab_daily_stock("TSLA")
    # grab_daily_stock("META")
    # grab_daily_stock("BABA")
    # grab_daily_stock("ORCL")
    # grab_daily_stock("CSCO")
    # grab_daily_stock("NVDA")
    # grab_daily_stock("JNJ")
    # grab_daily_stock("TSM")
    # grab_daily_stock("WMT")
    # grab_daily_stock("PFE")
    # grab_daily_stock("COST")
    # grab_daily_stock("KO")
    # grab_daily_stock("UNH")
    # grab_daily_stock("HSBC")
    # grab_daily_stock("QCOM")
    # grab_daily_stock("AMD")
