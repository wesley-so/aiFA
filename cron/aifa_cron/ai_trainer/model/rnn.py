from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from keras.layers import LSTM, Dense, Dropout
from keras.models import Sequential
from plotly.subplots import make_subplots
from pymongo import ASCENDING
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler

from ...database import stock_collection

folder = "/cron/aifa_cron/ai_trainer/result/rnn"
ohlcv = ["open", "low", "high", "close", "volume"]
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
    print(f"Stock data shape: {stock_data.shape}")
    stock_data["date"] = pd.to_datetime(stock_data["date"])
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
            x=stock_data["date"],
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

    # Add configurations to graph
    stock_fig.update_layout(xaxis_rangeslider_visible=False)
    stock_fig.update_layout(title_text=f"{symbol} Stock Data", xaxis_title="Date")
    stock_fig.update_xaxes(title_text="Date", row=3, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=1, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=2, col=1)
    stock_fig.update_yaxes(title_text="Volume (USD$)", row=3, col=1)
    stock_fig.write_html(f"{folder}/images/html/{symbol}_stock_graph.html")
    stock_fig.write_image(
        f"{folder}/images/png/plotly/{symbol}_stock_graph.png", height=800, width=1500
    )


def ai_model(symbol: str, feature: str):
    tss = TimeSeriesSplit(n_splits=10)
    stock_data = find_stock(symbol)
    dataset = stock_data.loc[:, [feature]]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(stock_data.loc[:, [feature]])
    scaled_data = pd.DataFrame(data=scaled_data, columns=[feature])

    # Prepare X_train, y_train, X_test and y_test
    for train_index, test_index in tss.split(scaled_data):
        X_train = scaled_data[: len(train_index)]
        X_test = scaled_data[len(train_index) : (len(train_index) + len(test_index))]
        y_train = dataset[: len(train_index)].values.ravel()
        y_test = dataset[len(train_index) : (len(train_index) + len(test_index))].values.ravel()

    # Process the data for LSTM
    trainX = np.array(X_train)
    testX = np.array(X_test)
    X_train = trainX.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = testX.reshape(X_test.shape[0], X_test.shape[1], 1)

    # Build Gated RNN - LSTM (Long short term ) network
    lstm_model = Sequential()
    # Adding the first LSTM layer and some Dropout regularisation
    lstm_model.add(
        LSTM(
            units=64,
            return_sequences=True,
            input_shape=(trainX.shape[1], 1),
        )
    )
    lstm_model.add(Dropout(0.2))
    # Adding a second LSTM layer and some Dropout regularisation
    lstm_model.add(LSTM(units=64, return_sequences=True))
    lstm_model.add(Dropout(0.5))
    # Adding a third LSTM layer and some Dropout regularisation
    lstm_model.add(LSTM(units=64, return_sequences=True))
    lstm_model.add(Dropout(0.5))
    # Adding a fourth LSTM layer and some Dropout regularisation
    lstm_model.add(LSTM(units=64, return_sequences=False))
    lstm_model.add(Dense(units=1))
    lstm_model.summary()
    # Model compilation
    lstm_model.compile(optimizer="adam", loss="mean_squared_error")
    history = lstm_model.fit(
        X_train,
        y_train,
        epochs=50,
        batch_size=16,
        shuffle=False,
        verbose=1,
    )

    # Prediction the testing data
    predictions = scaler.inverse_transform(lstm_model.predict(X_test))
    print(predictions, predictions.shape)

    # Evaluation metrics
    mse = np.mean((predictions - y_test) ** 2)
    print("MSE:", mse)
    print("RMSE:", np.sqrt(mse))

    # Visualize predicted result
    for train_index, test_index in tss.split(dataset):
        training = dataset[: len(train_index)]
        test = dataset[len(train_index) : (len(train_index) + len(test_index))].reset_index()
    temp = pd.DataFrame(data=predictions, columns=["prediction"])
    testing = pd.concat([test, temp], axis=1, join="inner")
    print(testing)

    plt.figure(figsize=(15,8))
    plt.plot(training[feature])
    plt.plot(testing.loc[:, [feature, "prediction"]])
    plt.title(f"{symbol} Stock {feature.title()} Price")
    plt.xlabel("Date")
    plt.ylabel(feature.title())
    plt.legend(["Train", "Test", "Prediction"])
    plt.savefig(f"{folder}/images/png/plt/{symbol}_{feature}_price.png", dpi=300, format="png", pad_inches=0.25)

    # Save tensorflow model
    lstm_model.save(f"{folder}/model/{symbol}_{feature}_model")
    print("Model finish training!!!")


if __name__ == "__main__":
    for i in grab_list:
        plot_stock_graph(i)
        for r in ohlcv:
            ai_model(i, r)
