import datetime
from os import getenv
from dotenv import load_dotenv
import json
import pandas as pd
import requests


def grab_historic_stock_daily(
    start_year: int,
    start_month: int,
    start_day: int,
    end_year: int,
    end_month: int,
    end_day: int,
):
    grabList = [
        "AAPL",
        "MSFT",
        "GOOG",
        "AMZN",
        "TSLA",
        "META",
        "BABA",
        "ORCL",
        "CSCO",
        "NVDA",
        "JNJ",
        "TSM",
        "WMT",
        "PFE",
        "COST",
        "KO",
        "UNH",
        "HSBC",
        "QCOM",
        "AMD",
    ]
    required_cols = ["date", "open", "high", "low", "close", "volume"]
    start_date = datetime.date(start_year, start_month, start_day)
    end_date = datetime.date(end_year, end_month, end_day)
    load_dotenv()
    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        stock_daily = requests.get(
            f"https://financialmodelingprep.com/api/v3/historical-price-full/{k}?from={start_date.strftime('%Y-%m-%d')}&to={end_date.strftime('%Y-%m-%d')}&apikey={api_key}"
        )
        data_json = json.loads(stock_daily.text)
        data_frame = pd.DataFrame(data_json["historical"])[required_cols].iloc[
            ::-1
        ]  # Grab historical stock price with required columns in reverse order
        data_frame.insert(0, "symbol", k)  # Add stock name
        # data_insert = {
        #     "symbol": data_frame[0],
        #     "date": data_frame[1],
        #     "open": data_frame[2],
        #     "high": data_frame[3],
        #     "low": data_frame[4],
        #     "close": data_frame[5],
        #     "volume": data_frame[6],
        # }
        print(data_frame)
    print("Stock historical data grabbed successfully!")


if __name__ == "__main__":
    grab_historic_stock_daily(2000, 1, 1, 2015, 12, 31)
