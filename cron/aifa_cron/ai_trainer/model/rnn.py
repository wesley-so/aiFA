from datetime import datetime

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from pymongo import ASCENDING
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf

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
    stock_data["date"] = pd.to_datetime(stock_data["date"])
    stock_data.set_index("date", inplace=True)
    stock_data.sort_index(inplace=True)
    return stock_data


# Plot stock data using matplotlib
def plot_stock_graph(symbol: str):
    stock_data = find_stock(symbol)
    stock_fig = make_subplots(specs=[[{"secondary_y": True}]])
    stock_fig.add_trace(go.Candlestick(x=stock_data.index, open=stock_data["open"], high=stock_data["high"], low=stock_data["low"], close=stock_data["close"], name="Price"), secondary_y=False)
    stock_fig.add_trace(go.Bar(x=stock_data.index, y=stock_data["volume"], name="Volume"), secondary_y=True)
    stock_fig.update_xaxes(rangebreaks=[dict(bounds=["sat","mon"]), dict(bounds=[16,9.5], pattern="hour")])
    # stock_fig.update_layout(xaxis_rangeslider_visible=False)  # Hide range slider of candlestick graph
    stock_fig.update_layout(title=f"{symbol} Stock Data", xaxis_title="Date", yaxis_title="Price")
    stock_fig.write_html(f"{folder}/{symbol}_stock_graph.html")
    stock_fig.write_image(f"{folder}/{symbol}_stock_graph.png", height=800, width=1500)


def ai_model(symbol: str, feature: str):
    tss = TimeSeriesSplit(n_splits=3)
    stock_data = find_stock(symbol)
    # Prepare X and y dataset
    X = stock_data.drop(labels=[feature], axis=1)
    y = stock_data.loc[:, [feature]]
    # Prepare X_train, y_train, X_test and y_test
    for train_index, test_index in tss.split(X):
        X_train, X_test = X.iloc[train_index, :], X.iloc[test_index,:]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]
    
    return 


if __name__ == "__main__":
    for i in grab_list:
        plot_stock_graph(i)
            # ai_model(i, r)
