from datetime import datetime
import jwt
from pymongo import MongoClient
import secrets
import os


MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")
conn = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/")
db = conn.aifa
session = db.session

jwt_secret = os.getenv("JWT_SECRET")


def signJWT(userId, expires_delta: int | None = None):
    nbf = int(datetime.now().strftime("%Y%m%d%H%M%S"))
    if expires_delta:
        exp = nbf + expires_delta
    else:
        exp = nbf + 259200  # 3 days to expire
    sessionId = secrets.token_urlsafe(16)
    payload = {"userId": userId, "nbf": nbf, "exp": exp, "sessionId": sessionId}
    return jwt.encode(payload, jwt_secret, algorithm="HS256")


def decodeJWT(token):
    return jwt.decode(token, jwt_secret, algorithms="HS256")


def expireJWT(token):
    session.remove({"token": token}, {"justOne": True})
