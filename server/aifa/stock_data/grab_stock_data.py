import datetime
import json
from os import getenv
import pandas as pd
import requests

from ..services.database import client, stock_collection


async def grab_historic_stock_daily(
    start_year: int,
    start_month: int,
    start_day: int,
    end_year: int,
    end_month: int,
    end_day: int,
):
    async with await client.start_session() as s:
        async with s.start_transaction():
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
            api_key = getenv("FMP_API_KEY")
            for k in grabList:
                stock_daily = requests.get(
                    f"https://financialmodelingprep.com/api/v3/historical-price-full/{k}?from={start_date.strftime('%Y-%m-%d')}&to={end_date.strftime('%Y-%m-%d')}&apikey={api_key}"
                )
                data_json = json.loads(stock_daily.text)
                data_frame = pd.DataFrame(data_json["historical"])[
                    required_cols
                ].iloc[
                    ::-1
                ]  # Grab historical stock price with required columns in reverse order
                data_frame.insert(0, "symbol", k)  # Add stock name
                insert_data = {"symbol": data_frame[0], "date": data_frame[1], "open": data_frame[2], "high": data_frame[3], "low": data_frame[4], "close": data_frame[5], "volume": data_frame[6]}
                stock_collection.insert_one(insert_data, session=s)
            print(data_frame)



def grab_financial_statement(limit: int):
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
    required_cols = [
        "symbol",
        "date",
        "reportedCurrency",
        "cik",
        "calendarYear",
        "period",
        "cashAndCashEquivalents",
        "shortTermInvestments",
        "netReceivables",
        "inventory",
        "otherCurrentAssets",
        "totalCurrentAssets",
        "propertyPlantEquipmentNet",
        "goodwill",
        "intangibleAssets",
        "longTermInvestments",
        "taxAssets",
        "otherNonCurrentAssets",
        "totalNonCurrentAssets",
        "otherAssets",
        "totalAssets",
        "accountPayables",
        "shortTermDebt",
        "taxPayables",
        "deferredRevenue",
        "otherCurrentLiabilities",
        "totalCurrentLiabilities",
        "longTermDebt",
        "otherNonCurrentLiabilities",
        "totalNonCurrentLiabilities",
        "otherLiabilities",
        "totalLiabilities",
        "commonStock",
        "retainedEarnings",
        "accumulatedOtherComprehensiveIncomeLoss",
        "othertotalStockholdersEquity",
        "totalStockholdersEquity",
        "minorityInterest",
        "totalEquity",
        "totalLiabilitiesAndTotalEquity",
        "totalInvestments",
        "totalDebt",
        "netDebt",
    ]
    period = "quarter"  # Grab every financial statement quarterly        # Grab 20 years financial statement
    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        f_s = requests.get(
            f"https://financialmodelingprep.com/api/v3/balance-sheet-statement/{k}?period={period}&limit={limit}&apikey={api_key}"
        )
        data_field_json = json.loads(f_s.text)
        data_frame = pd.DataFrame(data_field_json)[required_cols].iloc[::-1]
    print(data_frame)


if __name__ == "__main__":
    # grab_financial_statement()
    grab_historic_stock_daily(2015,1,1,2015,12,31)
