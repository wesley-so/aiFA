import secrets
from datetime import datetime, timezone
from math import ceil, floor
from time import time

import jwt

from ..config import config
from .database import session_collection


async def create_session(userId: str, expires_sec: int = 259200) -> str:
    """Create a user session with a user ID and an optional expire time in second.

    The expire time are default to 3 days.
    Return with a JWT token for later authentication of the user.
    """

    epoch_sec = time()

    nbf = floor(epoch_sec)
    exp = ceil(epoch_sec) + expires_sec
    sessionId = secrets.token_urlsafe(32)
    payload = {"userId": userId, "nbf": nbf, "exp": exp, "sessionId": sessionId}
    await session_collection.insert_one(
        {
            "sessionId": sessionId,
            "exp": datetime.fromtimestamp(epoch_sec, timezone.utc),
        }
    )
    return jwt.encode(payload, config["jwt_secret"], algorithm="HS256")


async def read_session(token):
    payload = jwt.decode(
        token, config["jwt_secret"], algorithms="HS256", options={"verify_exp": True}
    )

    if payload["sessionId"] is None:
        raise jwt.InvalidTokenError("session ID not found in JWT.")

    session = await session_collection.find_one({"sessionId", payload["sessionId"]})

    if session["exp"] is None:
        raise jwt.ExpiredSignatureError("Session expired.")

    return payload


async def destroy_session(token):
    payload = jwt.decode(
        token, config["jwt_secret"], algorithms="HS256", options={"verify_exp": False}
    )
    await session_collection.delete_one({"sessionId": payload["sessionId"]})
