from os import getenv
from types import MappingProxyType

MONGO_HOST = getenv("MONGO_HOST")
MONGO_PORT = getenv("MONGO_PORT")


config = MappingProxyType[str, str](
    {
        "mongo_uri": f"mongodb://{MONGO_HOST}:{MONGO_PORT}/",
        "mongo_db": "aifa",
        "mongo_collection_user": "user",
        "mongo_collection_session": "session",
        "mongo_collection_portfolio": "portfolio",
        "mongo_collection_stock": "stock",
        "jwt_secret": getenv("JWT_SECRET"),
        "cors_origins": (getenv("CORS_ORIGINS") or "").strip().split(","),
    }
)
