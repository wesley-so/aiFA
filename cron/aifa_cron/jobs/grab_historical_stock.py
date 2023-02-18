from datetime import datetime
from os import getenv

import requests

from ..database import insert_stock


def grab_historical_stock(
    start_year,
    start_month,
    start_day,
    end_year,
    end_month,
    end_day,
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
    start_date = datetime(start_year, start_month, start_day).strftime('%Y-%m-%d')
    end_date = datetime(end_year, end_month, end_day).strftime('%Y-%m-%d')
    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        r = requests.get(
            f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{k}?apikey={api_key}&from={start_date}&to={end_date}"
        )
        price_list = r.json()
        for i in price_list:
            i["symbol"] = k
        insert_stock(price_list)


if __name__ == "__main__":
    grab_historical_stock(2023, 2, 17, 2023, 2, 18)
