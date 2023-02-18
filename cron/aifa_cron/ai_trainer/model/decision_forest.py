from datetime import datetime

import pandas as pd
import tensorflow_decision_forests as tfdf

from ...database import stock_collection

# Get dataset from MongoDB to a Pandas dataframe
projection = {
    "_id": 0,
    "date": 1,
    "open": 1,
    "low": 1,
    "high": 1,
    "close": 1,
    "volume": 1,
    "symbol": 1,
}

train_data_query = {"date": {"$lte": datetime(2020, 12, 31)}}
train_data = stock_collection.find(train_data_query, projection)
train_df = pd.DataFrame(list(train_data))

test_data_query = {"date": {"$gt": datetime(2020, 12, 31)}}
test_data = stock_collection.find(test_data_query, projection)
test_df = pd.DataFrame(list(test_data))

# Convert the dataset into a TensorFlow dataset
train_ds = tfdf.keras.pd_dataframe_to_tf_dataset(train_df, label="Training Stock Dataset")
test_ds = tfdf.keras.pd_dataframe_to_tf_dataset(test_df, label="Testing Stock Dataset")

# Train a Random Forest model
decision_forest_model = tfdf.keras.RandomForestModel(num_trees=2000, winner_take_all_inference= False)
decision_forest_model.fit(train_ds)

# Summary of the model structure
decision_forest_model.summary()

# Evaluate the model.
decision_forest_model.compile(metrics=["accuracy"])
evaluation = decision_forest_model.evaluate(test_data, return_dict=True)
for name, value in evaluation.items():
  print(f"{name}: {value:.4f}")


# Export the model to a SavedModel.
decision_forest_model.save("../result/decision_forest_result")
