from os import getenv

import boto3
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse

from aifa.models.stock import StockModel
from aifa.services.stock import grab_daily_ohlcv

router = APIRouter(prefix="/stock", tags=["stock"])


@router.post("/daily", response_class=JSONResponse)
def daily(stock: StockModel):
    stock_data = grab_daily_ohlcv(stock.symbol)
    return JSONResponse(status_code=200, content=stock_data)


@router.post("/graph")
async def grab_graph(stock: StockModel):
    s3_client = boto3.client(
        "s3",
        endpoint_url=getenv("S3_ENDPOINT"),
        aws_access_key_id=getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=getenv("S3_SECRET_KEY"),
    )
    bucket_name = "stockgraph"
    try:
        result = s3_client.get_object(Bucket=bucket_name, Key=f"{stock.symbol}.html")
        return StreamingResponse(content=result["Body"].iter_chunks(), media_type="text/html")
    except Exception as error:
        if hasattr(error, "message"):
            raise HTTPException(
                status_code=error.message["response"]["Error"]["Code"],
                detail=error.message["response"]["Error"]["Message"],
            )
        else:
            raise HTTPException(status_code=500, detail=str(error))
