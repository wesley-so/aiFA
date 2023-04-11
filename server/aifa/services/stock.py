from os import getenv, path
from tempfile import TemporaryDirectory

import boto3
import pandas as pd
import requests
from keras.models import load_model
from pymongo import ASCENDING
from sklearn.preprocessing import MinMaxScaler

from aifa.dependencies.session import get_session_token

from .database import stock_collection

ohlcv = ["open", "low", "high", "close", "volume"]


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


async def grab_latest_close(symbol: str):
    token = await get_session_token()
    if token:
        api_key = getenv("FMP_API_KEY")
        r = requests.get(
            "https://financialmodelingprep.com/api/v3"
            + f"/quote-short/{symbol}?apikey={api_key}"
        )
        price = r.json()
        close_data = {
            "close": price[0]["price"],
        }
        return close_data
    else:
        return None


async def find_stock(symbol: str):
    # Preprocess of stock information
    query = {"symbol": symbol}
    projection = {
        "_id": 0,
        "date": 1,
        "symbol": 1,
        "open": 1,
        "high": 1,
        "low": 1,
        "close": 1,
        "volume": 1,
    }
    data = stock_collection.find(query, projection).sort("date", ASCENDING)
    print(type(data))
    stock_data = pd.DataFrame(await data.to_list(length=60000))
    for i in ohlcv:
        stock_data[i] = pd.to_numeric(stock_data[i])
    stock_data["date"] = pd.to_datetime(stock_data["date"])
    print(f"{symbol} stock data shape: {stock_data.shape}")
    return stock_data


async def grab_predict_data(stock: str):
    s3_client = boto3.client(
        "s3",
        endpoint_url=getenv("S3_ENDPOINT"),
        aws_access_key_id=getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=getenv("S3_SECRET_KEY"),
    )
    bucket_name = getenv("S3_BUCKET_LSTM")
    with TemporaryDirectory() as tmpdirname:
        print(tmpdirname)
        s3_client.download_file(
            bucket_name, f"{stock}_close_model.h5", path.join(tmpdirname, "model.h5")
        )
        lstm_model = load_model(path.join(tmpdirname, "model.h5"))
    lstm_model.summary()

    # Grab stock data
    stock_data = await find_stock(stock)

    for i in ohlcv:
        stock_data[i] = stock_data[i].apply(pd.to_numeric)
    data_length = len(stock_data)
    print("Stock data length:", data_length)
    dataset = stock_data["close"].values
    dataset = dataset.reshape(-1, 1)

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_dataset = scaler.fit_transform(dataset)

    n_lookback = 1955

    X_input = scaled_dataset[-n_lookback:]  # Last available input sequence
    X_input = X_input.reshape(1, n_lookback, 1)

    predict = lstm_model.predict(X_input).reshape(-1, 1)
    predict = scaler.inverse_transform(predict)

    predict_list = {
        "predict_1": float(predict[1].tolist()[0]),
        "predict_3": float(predict[3].tolist()[0]),
        "predict_5": float(predict[5].tolist()[0]),
    }

    return predict_list
