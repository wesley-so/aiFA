import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from keras.layers import Dense, Dropout, SimpleRNN
from keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler

from ..find_stock import find_stock

folder = "/cron/aifa_cron/ai_trainer/result/rnn"
ohlcv = ["open", "low", "high", "close", "volume"]
grab_list = [
    "AAPL",
    # "MSFT",
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


# Design AI Training Model (RNN with LSTM machine learning model)
def rnn_model(symbol: str, feature: str):
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

    # Data normalization
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(train_dataset)
    print(scaled_data.shape)

    # Prepare X_train and y_train
    X_train = []
    y_train = []
    time_step = 1950  # 5-days minutely data
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

    # Create SimpleRNN AI model (Regression Model) and some Dropout regularisation
    rnn_regressor = Sequential()
    rnn_regressor.add(
        SimpleRNN(
            units=50,
            activation="tanh",
            return_sequences=True,
            input_shape=(X_train.shape[1], 1),
        )
    )
    rnn_regressor.add(Dropout(0.2))
    # Adding the second RNN layer and some Dropout regularisation
    rnn_regressor.add(
        SimpleRNN(
            units=50,
            activation="tanh",
            return_sequences=True,
        )
    )
    rnn_regressor.add(Dropout(0.2))
    # Adding the third RNN layer and some Dropout regularisation
    rnn_regressor.add(
        SimpleRNN(
            units=50,
            activation="tanh",
            return_sequences=True,
        )
    )
    rnn_regressor.add(Dropout(0.2))
    # Adding the forth RNN layer and some Dropout regularisation
    rnn_regressor.add(SimpleRNN(units=50))
    rnn_regressor.add(Dropout(0.2))
    # Adding the output layer
    rnn_regressor.add(Dense(units=1))

    # SimpleRNN model compilation
    rnn_regressor.compile(optimizer="adam", loss="mean_squared_error")
    history = rnn_regressor.fit(X_train, y_train, epochs=20, batch_size=512)

    # Model prediction for train data
    y_predict = scaler.inverse_transform(rnn_regressor.predict(X_train))
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
        X_test.append(scaled_validation_data[i - 1950 : i, 0])
        y_test.append(scaled_validation_data[i, 0])
    # Reshape X_test and y_test
    X_test = np.array(X_test)
    y_test = np.array(y_test)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
    y_test = y_test.reshape(-1, 1)
    print("Shape of X_test after reshape:", X_test.shape)
    print("Shape of y_test after reshape:", y_test.shape)

    # Evaluation with validation data
    y_test_predict = scaler.inverse_transform(rnn_regressor.predict(X_test))

    # Visulization on RNN train and test data after prediction
    plt.figure(figsize=(30, 15))
    plt.plot(train_data["date"], train_data[feature], label="train_data", color="b")
    plt.plot(
        validation_data["date"],
        validation_data["open"],
        label="validation_data",
        color="g",
    )
    plt.plot(
        train_data["date"].iloc[time_step:], y_predict, label="y_predict", color="r"
    )
    plt.plot(
        validation_data["date"].iloc[time_step:],
        y_test_predict,
        label="y_test_predict",
        color="orange",
    )
    plt.xlabel("Date")
    plt.ylabel(f"{feature.title()}")
    plt.title(f"Simple RNN model, {symbol} Stock Data")
    plt.legend()
    plt.savefig(
        f"{folder}/rnn/images/png/{symbol}_{feature}_graph.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    # Print predicted result data
    X_input = stock_data.loc[stock_data.shape[0] - time_step :, feature].values
    X_input = scaler.fit_transform(X_input.reshape(-1, 1))
    X_input = X_input.reshape(1, 1950, 1)
    RNN_prediction = scaler.inverse_transform(rnn_regressor.predict(X_input))
    print(f"{symbol} Simple RNN prediction shape: {RNN_prediction.shape}")
    print(f"{symbol} Simple RNN prediction, {feature} prediction: {RNN_prediction[0,0]}")

    # Save tensorflow model
    rnn_regressor.save(f"{folder}/model/{symbol}_{feature}_model")
    print("Model finish training!!!")


if __name__ == "__main__":
    for i in grab_list:
        for r in ohlcv:
            rnn_model(i, r)
