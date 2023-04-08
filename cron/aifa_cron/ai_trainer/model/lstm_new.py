import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from keras.layers import LSTM, Dense, Dropout
from keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler

from ..find_stock import find_stock

folder = "/cron/aifa_cron/ai_trainer/result/lstm_new"
ohlcv = ["open", "low", "high", "close", "volume"]
grab_list = [
    "AAPL",
    "AMZN",
    "BABA",
    "CSCO",
    "GOOG",
    "META",
    "MSFT",
    "NVDA",
    "ORCL",
    "TSLA",
]


def lstm_new_model(symbol: str):
    # Grab stock data
    stock_data = find_stock(symbol)
    for i in ohlcv:
        stock_data[i] = stock_data[i].apply(pd.to_numeric)
    data_length = len(stock_data)
    print("Stock data length:", data_length)
    dataset = stock_data["close"].values
    dataset = dataset.reshape(-1, 1)

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_dataset = scaler.fit_transform(dataset)

    # Genereate the input and output sequences
    n_lookback = 3910  # 5-days lookback
    n_forecast = 1955  # 5-days forecast

    X = []
    Y = []

    for i in range(n_lookback, len(scaled_dataset) - n_forecast + 1):
        X.append(scaled_dataset[i - n_lookback : i])
        Y.append(scaled_dataset[i : i + n_forecast])

    X = np.array(X)
    Y = np.array(Y)

    # Fit model
    lstm_model = Sequential()
    lstm_model.add(LSTM(units=50, return_sequences=True, input_shape=(n_lookback, 1)))
    lstm_model.add(Dropout(0.2))
    lstm_model.add(LSTM(units=50))
    lstm_model.add(Dropout(0.2))
    lstm_model.add(Dense(n_forecast))

    lstm_model.compile(optimizer="adam", loss="mean_squared_error")
    history = lstm_model.fit(X, Y, epochs=30, batch_size=256)

    # Plot loss graph
    fig1, ax1 = plt.subplots(figsize=(15, 8))
    ax1.plot(history.history["loss"], label="loss")
    ax1.set_xlabel("Epochs", fontsize=18)
    ax1.set_ylabel("Loss", fontsize=18)
    fig1.suptitle(f"{symbol} close LSTM model loss", fontsize=25)
    ax1.legend()
    fig1.savefig(
        f"{folder}/images/history/loss/{symbol}_close_loss.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    # Generate forecast
    X_input = scaled_dataset[-n_lookback:]  # Last available input sequence
    X_input = X_input.reshape(1, n_lookback, 1)

    predict = lstm_model.predict(X_input).reshape(-1, 1)
    predict = scaler.inverse_transform(predict)
    print(f"{symbol} LSTM new model prediction shape:", predict.shape)
    print(f"{symbol} LSTM new model prediction:", predict)

    # Resulting data in DataFrame format
    # Creat known data as df_past
    df_past = stock_data["close"].reset_index()
    df_past.rename(columns={"index": "date", "Close": "actual"}, inplace=True)
    df_past["date"] = pd.to_datetime(df_past["date"])
    df_past["forecast"] = np.nan
    df_past["forecast"].iloc[-1] = df_past["actual"].iloc[-1]
    print("Known data:", df_past)

    # Create forecast data as df_future
    df_future = pd.DataFrame(columns=["date", "actual", "forecast"])
    df_future["date"] = pd.date_range(
        start=df_past["date"].iloc[-1] + pd.Timedelta(days=1), periods=n_forecast
    )
    df_future["forecast"] = predict.flatten()
    df_future["actual"] = np.nan
    print("Predict data:", df_future)

    result = df_past.append(df_future).set_index("date")

    # Plot result
    fig2, ax2 = plt.subplots(figsize=(30, 15))
    ax2.plot(result)
    ax2.set_xlabel("Date", fontsize=18)
    ax2.set_ylabel("Price (USD)", fontsize="medium")
    fig2.suptitle(f"LSTM model, {symbol} Stock Data", fontsize=25)
    ax2.legend()
    fig2.savefig(f"{folder}/images/png/{symbol}_close_graph.jpg")

    # Save LSTM trained model
    lstm_new_model.save(f"{folder}/model/{symbol}_close_model.h5")
    print(f"{symbol} LSTM new model finish training!!!")


if __name__ == "__main__":
    for i in grab_list:
        lstm_new_model(i)
