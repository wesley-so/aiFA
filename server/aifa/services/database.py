from pymongo import DESCENDING, MongoClient

from ..config import config

SESSION_EXPIRE_INDEX_NAME = "session_expire"

client = MongoClient(config["mongo_uri"])
db = client[config["mongo_db"]]
user_collection = db[config["mongo_collection_user"]]
session_collection = db[config["mongo_collection_session"]]


def init_database():
    indexes = session_collection.index_information()

    if SESSION_EXPIRE_INDEX_NAME not in indexes:
        session_collection.create_index(
            [("exp", DESCENDING)], expireAfterSeconds=0, name=SESSION_EXPIRE_INDEX_NAME
        )
