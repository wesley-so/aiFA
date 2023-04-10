from pydantic import BaseModel, Field


class Portfolio(BaseModel):
    portfolio: list[dict] = Field(title="Portfolio dictionary")
