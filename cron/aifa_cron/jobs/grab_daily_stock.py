from datetime import datetime
from os import getenv

import requests

from ..database import stock_collection


def insert_stock(data):
    stock_collection.insert_many(data)


def grab_daily_stock(
    start_year: int,
    start_month: int,
    start_day: int,
    end_year: int,
    end_month: int,
    end_day: int,
):
    grabList = [
        # "AAPL",
        "MSFT",
        # "GOOG",
        # "AMZN",
        # "TSLA",
        # "META",
        # "BABA",
        # "ORCL",
        # "CSCO",
        # "NVDA",
        # "JNJ",
        # "TSM",
        # "WMT",
        # "PFE",
        # "COST",
        # "KO",
        # "UNH",
        # "HSBC",
        # "QCOM",
        # "AMD",
    ]
    start_date = datetime.date(start_year, start_month, start_day)
    end_date = datetime.date(end_year, end_month, end_day)
    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        r = requests.get(
            f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{k}?apikey={api_key}&from={start_date.strftime('%Y-%m-%d')}&to={end_date.strftime('%Y-%m-%d')}"
        )
        price_list = r.json()
        for i in price_list:
            i["symbol"] = k
        # print(price_list)
        insert_stock(price_list)


if __name__ == "__main__":
    grab_daily_stock(2020, 12, 21, 2020, 12, 31)
