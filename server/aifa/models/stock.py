from pydantic import BaseModel, Field


class StockModel(BaseModel):
    symbol: str = Field(title="Stock symbol", max_length=4)
