from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from pymongo import ASCENDING
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
# import tensorflow as tf
from tensorflow import keras

from ...database import stock_collection

folder = "/cron/aifa_cron/ai_trainer/result/rnn"
ohlc = ["open", "high", "low", "close"]
grab_list = [
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


def find_stock(symbol: str):
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
    stock_data = pd.DataFrame(list(data))
    print(stock_data.shape)
    stock_data["date"] = pd.to_datetime(stock_data["date"])
    stock_data.set_index("date", inplace=True)
    stock_data.sort_index(inplace=True)
    return stock_data


# Plot stock data using matplotlib
def plot_stock_graph(symbol: str):
    stock_data = find_stock(symbol)
    stock_fig = make_subplots(
        rows=3,
        cols=1,
        shared_xaxes=True,
        subplot_titles=(
            f"{symbol} OHLC",
            f"{symbol} Moving Average",
            f"{symbol} Volume",
        ),
        vertical_spacing=0.05,
    )
    # Plot Candlestick graph
    stock_fig.add_trace(
        go.Candlestick(
            x=stock_data.index,
            open=stock_data["open"],
            high=stock_data["high"],
            low=stock_data["low"],
            close=stock_data["close"],
            name="Price",
        ),
        row=1,
        col=1,
    )

    # Create SMA and EMA as techincal indicator
    # EMA (Exponential Moving Average)
    stock_data["EMA_9"] = stock_data["close"].ewm(9).mean().shift()
    # SMA (Simple Moving Average)
    stock_data["SMA_5"] = stock_data["close"].rolling(5).mean().shift()
    stock_data["SMA_10"] = stock_data["close"].rolling(10).mean().shift()
    # Plot SMA and EMA graph
    stock_fig.add_trace(
        go.Scatter(x=stock_data.index, y=stock_data["EMA_9"], name="EMA 9"),
        row=2,
        col=1,
    )
    stock_fig.add_trace(
        go.Scatter(x=stock_data.index, y=stock_data["SMA_5"], name="SMA 5"),
        row=2,
        col=1,
    )
    stock_fig.add_trace(
        go.Scatter(x=stock_data.index, y=stock_data["SMA_10"], name="SMA 10"),
        row=2,
        col=1,
    )

    # Plot volume graph (graph type problem: Bar chart cannot show infinitesimal width)
    stock_fig.add_trace(
        go.Scatter(
            x=stock_data.index, y=stock_data["volume"], name="Volume", showlegend=False
        ),
        row=3,
        col=1,
    )

    stock_fig.update_xaxes(
        rangebreaks=[
            dict(bounds=["sat", "mon"]),
            dict(bounds=[16, 9.5], pattern="hour"),
        ],
    )

    # Hide range slider of candlestick graph
    stock_fig.update_layout(xaxis_rangeslider_visible=False)
    stock_fig.update_layout(title_text=f"{symbol} Stock Data", xaxis_title="Date")
    stock_fig.update_xaxes(title_text="Date", row=3, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=1, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=2, col=1)
    stock_fig.update_yaxes(title_text="Volume (USD$)", row=3, col=1)
    stock_fig.write_html(f"{folder}/{symbol}_stock_graph.html")
    stock_fig.write_image(f"{folder}/{symbol}_stock_graph.png", height=800, width=1500)


def ai_model(symbol: str, feature: str):
    tss = TimeSeriesSplit(n_splits=3)
    stock_data = find_stock(symbol)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(stock_data.iloc[:, 1:5])
    print(scaled_data)
    # Prepare X and y dataset
    X = np.delete(scaled_data, 0, 1)
    print(X)
    y = scaled_data[:, [feature]]
    print(y)
    # Prepare X_train, y_train, X_test and y_test
    for train_index, test_index in tss.split(X):
        X_train, X_test = X.iloc[train_index, 1:5], X.iloc[test_index, 1:5]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

    # Build Gated RNN - LSTM (Long short term ) network
    rnn_model = keras.models.Sequential()
    rnn_model.add(
        keras.layers.LSTM(
            units=64, return_sequences=True, input_shape=(X_train.shape[1], 1)
        )
    )
    rnn_model.add(keras.layers.LSTM(units=64))
    rnn_model.add(keras.layers.Dense(32))
    rnn_model.add(keras.layers.Dropout(0.5))
    rnn_model.add(keras.layers.Dense(1))
    rnn_model.summary
    return


if __name__ == "__main__":
    for i in grab_list:
        plot_stock_graph(i)
        # for r in ohlc:
        # ai_model(i, r)
