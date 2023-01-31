from bson import json_util, ObjectId
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
import jwt
from jwt.exceptions import ExpiredSignatureError
import json
from pymongo import MongoClient
import secrets
import os


MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")
conn = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/")
db = conn.aifa
session = db.session

jwt_secret = os.getenv("JWT_SECRET")


def signJWT(userId):
    nbf = int(datetime.now().strftime("%Y%m%d%H%M%S"))
    exp = nbf + 259200  # 3 days to expire
    sessionId = secrets.token_urlsafe(16)
    payload = {"userId": userId, "nbf": nbf, "exp": exp, "sessionId": sessionId}
    print(payload)
    return jwt.encode(payload, jwt_secret, algorithm="HS256")


def checkJWT(token):
    try:
        payload = jwt.decode(token, jwt_secret, algorithms="HS256")
        return payload

    except ExpiredSignatureError as error:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": f"Unable to decode your token, error:{error}",
            },
        )


def expireJWT(token):
    try:
        jwt.decode(token, jwt_secret, algorithms="HS256")
        session.remove({"token": token}, {"justOne": True})
    except ExpiredSignatureError as error:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": f"Unable to decode your token, error:{error}",
            },
        )


if __name__ == "__main__":
    signJWT()
    checkJWT()
    expireJWT()
