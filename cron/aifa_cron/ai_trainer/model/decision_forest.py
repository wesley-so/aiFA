import numpy as np
import pandas as pd
import tensorflow_decision_forests as tfdf
from pymongo import ASCENDING
from sklearn.model_selection import TimeSeriesSplit

from ...database import stock_collection

# Get dataset from MongoDB to a Pandas dataframe
projection = {
    "_id": 0,
}


def decision_forest(label: str, feature: str):
    query = {"symbol": label}
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

    # Use Sklearn Time Series Split to split time series stock data
    tss = TimeSeriesSplit(n_splits=2)
    stock_data.set_index("date", inplace=True)
    stock_data.sort_index(inplace=True)
    X = stock_data.drop(labels=[feature], axis=1)
    y = stock_data[feature]
    print(y.shape)

    # Split train and test data
    for train_index, test_index in tss.split(X):
        X_train, X_test = X.iloc[train_index, :], X.iloc[test_index, :]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

    # Convert the dataset into a TensorFlow dataset
    X_train_ds = tfdf.keras.pd_dataframe_to_tf_dataset(X_train)
    y_train_ds = tfdf.keras.pd_dataframe_to_tf_dataset(y_train)
    X_test_ds = tfdf.keras.pd_dataframe_to_tf_dataset(X_test)
    y_test_ds = tfdf.keras.pd_dataframe_to_tf_dataset(y_test)

    # Train a Random Forest model
    decision_forest_model = tfdf.keras.RandomForestModel(
        num_trees=2000, winner_take_all_inference=False
    )
    decision_forest_model.fit(X_train_ds, y_train_ds)

    # Summary of the model structure
    decision_forest_model.summary()

    # Evaluate the model.
    decision_forest_model.compile(metrics=["accuracy"])
    evaluation = decision_forest_model.evaluate(X_test_ds, y_test_ds, return_dict=True)
    for name, value in evaluation.items():
        print(f"{name}: {value:.4f}")

    # Export the model to a SavedModel.
    decision_forest_model.save(f"../result/decision_forest_result/{label}_{feature}")


if __name__ == "__main__":
    decision_forest("MSFT", "open")
    decision_forest("MSFT", "close")
