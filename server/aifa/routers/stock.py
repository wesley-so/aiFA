from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from aifa.dependencies.session import get_session_user
from aifa.models.stock import StockModel
from aifa.models.user import UserModel
from aifa.services.stock import grab_latest_close, grab_predict_data, grab_daily_ohlcv

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
        
@router.post("/latest/close", response_class=JSONResponse)
async def close(stock: StockModel):
    close_data = await grab_latest_close(stock.symbol)
    if not close_data:
        raise HTTPException(status_code=401, detail="User unauthorized.")
    return JSONResponse(status_code=200, content=close_data)


@router.post("/latest/close", response_class=JSONResponse)
async def close(stock: StockModel):
    close_data = await grab_latest_close(stock.symbol)
    if not close_data:
        raise HTTPException(status_code=401, detail="User unauthorized.")
    return JSONResponse(status_code=200, content=close_data)


@router.post("/portfolio/all", response_class=JSONResponse)
async def latest_portfolio(self_info: UserModel = Depends(get_session_user)):
    if self_info:
        username = self_info.username
        query = {"username": username}
        projection = {"_id": 0}
        result = portfolio_collection.find(query, projection)
        result_list = await result.to_list(length=3)

        return JSONResponse(status_code=200, content=result_list)
    else:
        raise HTTPException(status_code=401, detail="User unauthorized.")


@router.post("/predict", response_class=JSONResponse)
async def prediction(
    stock: StockModel, self_info: UserModel = Depends(get_session_user)
):
    if self_info:
        result_list = await grab_predict_data(stock.symbol)
        return JSONResponse(status_code=200, content=result_list)
    else:
        raise HTTPException(status_code=401, detail="User unauthorized.")
