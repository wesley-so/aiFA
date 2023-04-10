from time import time

from aifa.dependencies.session import get_session_token

from .database import portfolio_collection


async def create_portfolio(username: str, portfolio: dict):
    token = get_session_token()
    if token:
        timestamp = time()
        await portfolio_collection.insert_one(
            {"username": username, "portfolio": portfolio, "timestamp": timestamp}
        )
    else:
        return None
