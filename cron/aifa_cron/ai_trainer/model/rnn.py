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


# Design AI Training Model (RNN with LSTM machine learning model)
def rnn_model(symbol: str, feature: str):
    stock_data = find_stock(symbol)
    for i in ohlcv:
        stock_data[i] = stock_data[i].apply(pd.to_numeric)
    data_length = len(stock_data)
    split_ratio = 0.9
    train_length = round(data_length * split_ratio)
    validation_length = data_length - train_length
    print(f"{symbol} {feature} Data length:", data_length)
    print(f"{symbol} {feature} Train data length:", train_length)
    print(f"{symbol} {feature} Test data length:", validation_length)

    # Spliting train and validation data
    train_data = stock_data.loc[: train_length - 1, ["date", feature]]
    validation_data = stock_data.loc[train_length:, ["date", feature]]

    # Create training dataset
    train_dataset = train_data[feature].values
    train_dataset = train_dataset.reshape(-1, 1)

    # Data normalization
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(train_dataset)

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

    # Prepare X_test and y_test
    validation_dataset = validation_data[feature].values
    validation_dataset = validation_dataset.reshape(-1, 1)
    scaled_validation_data = scaler.transform(validation_dataset)

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

    # Create SimpleRNN AI model (Regression Model) and some Dropout regularisation
    rnn_regressor = Sequential()
    # Adding the first RNN layer
    rnn_regressor.add(
        SimpleRNN(
            units=50,
            activation="tanh",
            return_sequences=True,
            input_shape=(X_train.shape[1], 1),
        )
    )
    rnn_regressor.add(Dropout(0.2))
    # Adding the second RNN layer
    rnn_regressor.add(SimpleRNN(units=50, return_sequences=False))
    # Adding the output layer
    rnn_regressor.add(Dense(units=1))

    # SimpleRNN model compilation
    rnn_regressor.compile(
        optimizer="adam",
        loss="mean_squared_error",
        metrics=["accuracy"],
    )
    history = rnn_regressor.fit(
        X_train, y_train, epochs=20, validation_data=(X_test, y_test), batch_size=512
    )

    # Plot RNN model accuracy and model loss
    fig1, ax1 = plt.subplots(figsize=(15, 8))
    ax1.plot(history.history["accuracy"], label="accuracy")
    ax1.plot(history.history["val_accuracy"], label="val_accuracy")
    ax1.set_xlabel("Epochs")
    ax1.set_ylabel("Accuracy")
    fig1.suptitle(f"{symbol} {feature} RNN model accuracy", fontsize=25)
    ax1.legend()
    fig1.savefig(
        f"{folder}/images/history/accuracy/{symbol}_{feature}_accuracy.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )


    fig2, ax2 = plt.subplots(figsize=(15, 8))
    ax2.plot(history.history["loss"], label="loss")
    ax2.plot(history.history["val_loss"], label="val_loss")
    ax2.set_xlabel("Epochs")
    ax2.set_ylabel("Loss")
    fig2.suptitle(f"{symbol} {feature} RNN model loss", fontsize=25)
    ax2.legend()
    fig2.savefig(
        f"{folder}/images/history/loss/{symbol}_{feature}_loss.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )

    # Model prediction for train data
    y_predict = scaler.inverse_transform(rnn_regressor.predict(X_train))
    print("y_predict shape: ", y_predict.shape)
    y_train = scaler.inverse_transform(y_train)
    print("y_train shape: ", y_train.shape)

    # Evaluation with validation data
    y_test_predict = scaler.inverse_transform(rnn_regressor.predict(X_test))

    # Visulization on RNN train and test data after prediction
    fig3, ax3 = plt.subplots(figsize=(30, 15))
    ax3.plot(train_data["date"], train_data[feature], label="train_data", color="b")
    ax3.plot(
        validation_data["date"],
        validation_data[feature],
        label="validation_data",
        color="g",
    )
    ax3.plot(
        train_data["date"].iloc[time_step:], y_predict, label="y_predict", color="r"
    )
    ax3.plot(
        validation_data["date"].iloc[time_step:],
        y_test_predict,
        label="y_test_predict",
        color="orange",
    )
    ax3.set_xlabel("Date")
    ax3.set_ylabel(f"{feature.title()}")
    fig3.suptitle(f"Simple RNN model, {symbol} Stock Data", fontsize=25)
    ax3.legend()
    fig3.savefig(
        f"{folder}/images/png/{symbol}_{feature}_graph.png",
        dpi=300,
        format="png",
        pad_inches=0.25,
    )
    plt.close()

    # Print predicted result data
    X_input = stock_data.loc[stock_data.shape[0] - time_step :, feature].values
    X_input = scaler.fit_transform(X_input.reshape(-1, 1))
    X_input = X_input.reshape(1, time_step, 1)
    RNN_prediction = scaler.inverse_transform(rnn_regressor.predict(X_input))
    print(f"{symbol} Simple RNN prediction shape: {RNN_prediction.shape}")
    print(
        f"{symbol} Simple RNN prediction, {feature} prediction: {RNN_prediction[0,0]}"
    )

    # Save tensorflow model
    rnn_regressor.save(f"{folder}/model/{symbol}_{feature}_model.h5")
    print("Model finish training!!!")


if __name__ == "__main__":
    for i in grab_list:
        for r in ohlcv:
            rnn_model(i, r)
