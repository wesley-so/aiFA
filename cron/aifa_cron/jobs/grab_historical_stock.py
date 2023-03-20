from datetime import date, datetime, timedelta
from os import getenv

import requests

from ..database import init_database, insert_stock

init_database()


def grab_historical_stock(
    start_year,
    start_month,
    start_day,
    end_year,
    end_month,
    end_day,
):
    grab_list = [
        # "AAPL",
        # "AMZN",
        # "BABA",
        # "CSCO",
        # "GOOG",
        # "META",
        # "MSFT",
        # "NVDA"
        # "ORCL",
        # "TSLA"
    ]
    start_date = datetime(start_year, start_month, start_day).strftime("%Y-%m-%d")
    end_date = datetime(end_year, end_month, end_day).strftime("%Y-%m-%d")
    api_key = getenv("FMP_API_KEY")
    for k in grab_list:
        r = requests.get(
            f"https://financialmodelingprep.com/api/v3/historical-chart/1min/{k}?apikey={api_key}&from={start_date}&to={end_date}"  # noqa: E501
        )
        price_list = r.json()
        for i in price_list:
            i["symbol"] = k
        insert_stock(price_list)


if __name__ == "__main__":
    start_date = date(2022, 9, 1)
    end_date = date(2023, 3, 16)
    delta = timedelta(days=4)
    while start_date <= end_date:
        temp_date = start_date + delta
        grab_historical_stock(
            start_date.year,
            start_date.month,
            start_date.day,
            temp_date.year,
            temp_date.month,
            temp_date.day,
        )
        start_date = start_date + delta
