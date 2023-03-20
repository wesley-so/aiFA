import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from keras.layers import LSTM, Dense, Dropout
from keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler

from ..find_stock import find_stock

folder = "/cron/aifa_cron/ai_trainer/result/lstm"
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


def lstm_model(symbol: str, feature: str):
    stock_data = find_stock(symbol)
    for i in ohlcv:
        stock_data[i] = stock_data[i].apply(pd.to_numeric)
    data_length = len(stock_data)
    split_ratio = 0.9
    train_length = round(data_length * split_ratio)
    validation_length = data_length - train_length
    print("Data length:", data_length)
    print("Train data length:", train_length)
    print("Test data length:", validation_length)

    # Spliting train and validation data
    train_data = stock_data.loc[:train_length, ["date", feature]]
    validation_data = stock_data.loc[train_length:, ["date", feature]]

    # Create training dataset
    train_dataset = train_data[feature].values
    train_dataset = train_dataset.reshape(-1, 1)
    print(f"{symbol} train data shape: {train_data.shape}")

    # Data normalization
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(train_dataset)
    print("Shape of scaled_data:", scaled_data.shape)

    # Prepare X_train and y_train
    X_train = []
    y_train = []
    time_step = 1954  # 5-days minutely data
    for i in range(time_step, train_length):
        X_train.append(scaled_data[i - time_step : i, 0])
        y_train.append(scaled_data[i, 0])
    # Reshape X_train and y_train
    X_train = np.array(X_train)
    y_train = np.array(y_train)
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    y_train = y_train.reshape(y_train.shape[0], 1)
    print("Shape of X_train after reshape:", X_train.shape)
    print("Shape of y_train after reshape:", y_train.shape)

    # Create LSTM (Long Short Term Memory) AI model and some Dropout regularisation
    lstm_model = Sequential()
    lstm_model.add(
        LSTM(units=64, return_sequences=True, input_shape=(X_train.shape[1], 1))
    )
    lstm_model.add(Dropout(0.2))
    # Adding the second LSTM layer
    lstm_model.add(LSTM(units=64, return_sequences=False))
    lstm_model.add(Dense(units=32))
    # Adding the output layer
    lstm_model.add(Dense(units=1))
    lstm_model.compile(
        optimizer="adam", loss="mean_squared_error", metrics=["accuracy"]
    )
    history = lstm_model.fit(X_train, y_train, epochs=20, batch_size=128)

    # Plot LSTM model accuracy and model loss
    plt.plot(history.history["accuracy"])
    plt.plot(history.history["val_accuracy"])
    plt.title(f"{symbol} {feature} LSTM model accuracy")
    plt.xlabel("Epochs")
    plt.ylabel("Accuracy")
    plt.legend(["train", "test"], loc="upper left")
    plt.save(
        f"{folder}/images/history/accuracy/{symbol}_{feature}_accuracy.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    plt.plot(history.history["loss"])
    plt.plot(history.history["val_loss"])
    plt.title(f"{symbol} {feature} LSTM model loss")
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.legend(["train", "test"], loc="upper right")
    plt.save(
        f"{folder}/images/history/loss/{symbol}_{feature}_loss.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    # Model prediction for train data
    y_predict = scaler.inverse_transform(lstm_model.predict(X_train))
    print("y_predict shape: ", y_predict.shape)
    y_train = scaler.inverse_transform(y_train)
    print("y_train shape: ", y_train.shape)

    # Prepare X_test and y_test
    validation_dataset = validation_data[feature].values
    validation_dataset = validation_dataset.reshape(-1, 1)
    scaled_validation_data = scaler.fit_transform(validation_dataset)
    print("Shape of scaled validation dataset:", scaled_validation_data.shape)

    X_test = []
    y_test = []
    for i in range(time_step, validation_length):
        X_test.append(scaled_validation_data[i - time_step : i, 0])
        y_test.append(scaled_validation_data[i, 0])
    # Reshape X_test and y_test
    X_test = np.array(X_test)
    y_test = np.array(y_test)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
    y_test = y_test.reshape(-1, 1)
    print("Shape of X_test after reshape:", X_test.shape)
    print("Shape of y_test after reshape:", y_test.shape)

    # Visulization on RNN train and test data after prediction
    plt.figure(figsize=(30, 15))
    plt.plot(
        scaler.inverse_transform(lstm_model.predict(X_test)),
        label="y_test_predict",
        color="b",
    )
    plt.plot(scaler.inverse_transform(y_test), label="y_test", color="r")
    plt.xlabel("Days")
    plt.ylabel(f"{feature.title()}")
    plt.title(f"LSTM model, {symbol} Stock Data")
    plt.legend()
    plt.savefig(
        f"{folder}/images/png/{symbol}_{feature}_graph.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    # Print predicted result data
    X_input = stock_data.loc[stock_data.shape[0] - time_step :, feature].values
    print(X_input)
    X_input = scaler.fit_transform(X_input.reshape(-1, 1))
    X_input = X_input.reshape(1, time_step, 1)
    LSTM_prediction = scaler.inverse_transform(lstm_model.predict(X_input))
    print(f"{symbol} LSTM prediction shape: {LSTM_prediction.shape}")
    print(f"{symbol} LSTM prediction, {feature} prediction: {LSTM_prediction[0,0]}")

    # Save tensorflow model
    lstm_model.save(f"{folder}/model/{symbol}_{feature}_model")
    print("LSTM model finish training!!!")


if __name__ == "__main__":
    for i in grab_list:
        for r in ohlcv:
            lstm_model(i, r)
