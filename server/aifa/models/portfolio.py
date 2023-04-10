from pydantic import BaseModel, Field


class Portfolio(BaseModel):
    portfolio: object = Field(title="Portfolio dictionary")
