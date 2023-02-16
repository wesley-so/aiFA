from os import getenv

import requests

from ..database import init_database, insert_stock

init_database()


def grab_daily_stock():
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

    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        r = requests.get(
            f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{k}?apikey={api_key}"
        )
        price_list = r.json()
        for i in price_list:
            i["symbol"] = k
        # print(price_list)
        insert_stock(price_list)


if __name__ == "__main__":
    grab_daily_stock()
