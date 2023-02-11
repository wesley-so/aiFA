from os import getenv
from dotenv import load_dotenv
import json
import pandas as pd
import requests


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
    period = "quarter"  # Grab every financial statement quarterly
    load_dotenv()
    api_key = getenv("FMP_API_KEY")
    for k in grabList:
        f_s = requests.get(
            f"https://financialmodelingprep.com/api/v3/balance-sheet-statement/{k}?period={period}&limit={limit}&apikey={api_key}"
        )
        data_field_json = json.loads(f_s.text)
        data_frame = pd.DataFrame(data_field_json)[required_cols].iloc[::-1]
        # data_insert = {
        #     "symbol": data_frame[0],
        #     "date": data_frame[1],
        #     "reportedCurrency": data_frame[2],
        #     "cik": data_frame[3],
        #     "calendarYear": data_frame[4],
        #     "period": data_frame[5],
        #     "cashAndCashEquivalents": data_frame[6],
        #     "shortTermInvestments": data_frame[7],
        #     "netReceivables": data_frame[8],
        #     "inventory": data_frame[9],
        #     "otherCurrentAssets": data_frame[10],
        #     "totalCurrentAssets": data_frame[11],
        #     "propertyPlantEquipmentNet": data_frame[12],
        #     "goodwill": data_frame[13],
        #     "intangibleAssets": data_frame[14],
        #     "longTermInvestments": data_frame[15],
        #     "taxAssets": data_frame[16],
        #     "otherNonCurrentAssets": data_frame[17],
        #     "totalNonCurrentAssets": data_frame[18],
        #     "otherAssets": data_frame[19],
        #     "totalAssets": data_frame[20],
        #     "accountPayables": data_frame[21],
        #     "shortTermDebt": data_frame[22],
        #     "taxPayables": data_frame[23],
        #     "deferredRevenue": data_frame[24],
        #     "otherCurrentLiabilities": data_frame[25],
        #     "totalCurrentLiabilities": data_frame[26],
        #     "longTermDebt": data_frame[27],
        #     "otherNonCurrentLiabilities": data_frame[28],
        #     "totalNonCurrentLiabilities": data_frame[29],
        #     "otherLiabilities": data_frame[30],
        #     "totalLiabilities": data_frame[31],
        #     "commonStock": data_frame[32],
        #     "retainedEarnings": data_frame[33],
        #     "accumulatedOtherComprehensiveIncomeLoss": data_frame[34],
        #     "othertotalStockholdersEquity": data_frame[35],
        #     "totalStockholdersEquity": data_frame[36],
        #     "minorityInterest": data_frame[37],
        #     "totalEquity": data_frame[38],
        #     "totalLiabilitiesAndTotalEquity": data_frame[39],
        #     "totalInvestments": data_frame[40],
        #     "totalDebt": data_frame[41],
        #     "netDebt": data_frame[42],
        # }
        print(data_frame)

if __name__ == "__main__":
    grab_financial_statement(80)
