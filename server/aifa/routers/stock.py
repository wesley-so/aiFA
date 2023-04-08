from aifa.models.stock import StockModel
from aifa.services.stock import grab_daily_ohlcv
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/stock", tags=["stock"])


@router.post("/daily", response_class=JSONResponse)
def daily(stock: StockModel):
    stock_data = grab_daily_ohlcv(stock.symbol)
    return JSONResponse(status_code=200, content=stock_data)
