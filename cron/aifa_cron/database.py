from pymongo import ASCENDING, MongoClient

from .config import config

STOCK_UNIQUE_INDEX_NAME = "stock_unique"

client = MongoClient(config["mongo_uri"])
db = client[config["mongo_db"]]
stock_collection = db[config["mongo_collection_stock"]]


def init_database():
    indexes = stock_collection.index_information()

    if STOCK_UNIQUE_INDEX_NAME not in indexes:
        stock_collection.create_index(
            [("date", ASCENDING), ("symbol", ASCENDING)], name=STOCK_UNIQUE_INDEX_NAME
        )
