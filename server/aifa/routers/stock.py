import base64
from os import getenv
from time import time

import boto3
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from aifa.dependencies.session import get_session_token, get_session_user
from aifa.models.portfolio import Portfolio
from aifa.models.stock import StockModel
from aifa.models.user import UserModel
from aifa.services.stock import grab_daily_ohlcv

from ..services.database import portfolio_collection

router = APIRouter(prefix="/stock", tags=["stock"])


@router.post("/daily", response_class=JSONResponse)
async def daily(stock: StockModel, user=Depends(get_session_user)):
    stock_data = await grab_daily_ohlcv(stock.symbol)
    if not stock_data:
        raise HTTPException(status_code=401, detail="User unauthorized.")
    return JSONResponse(status_code=200, content=stock_data)


@router.post("/graph")
async def grab_graph(stock: StockModel, user=Depends(get_session_user)):
    s3_client = boto3.client(
        "s3",
        endpoint_url=getenv("S3_ENDPOINT"),
        aws_access_key_id=getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=getenv("S3_SECRET_KEY"),
    )
    bucket_name = "stockgraph"
    try:
        file_byte = s3_client.get_object(Bucket=bucket_name, Key=f"{stock.symbol}.png")[
            "Body"
        ].read()
        encoded_string = base64.b64encode(file_byte).decode("utf-8")
        return JSONResponse(status_code=200, content=encoded_string)
    except Exception as error:
        if hasattr(error, "message"):
            raise HTTPException(
                status_code=error.message["response"]["Error"]["Code"],
                detail=error.message["response"]["Error"]["Message"],
            )
        else:
            raise HTTPException(status_code=500, detail=str(error))


@router.post("/portfolio", response_class=JSONResponse)
async def portfolio(
    portfolio: Portfolio, self_info: UserModel = Depends(get_session_user)
):
    token = await get_session_token()
    username = self_info.username
    print(username)
    if token:
        timestamp = time()
        await portfolio_collection.insert_one(
            {
                "username": username,
                "portfolio": portfolio.portfolio,
                "timestamp": timestamp,
            }
        )
        return JSONResponse(status_code=200, content="Portfolio created successfully.")
    else:
        raise HTTPException(status_code=401, detail="User unauthorized.")
