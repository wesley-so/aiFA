from pydantic import BaseModel, Field


class Portfolio(BaseModel):
    username: str = Field(title="Username", max_length=50)
    portfolio: dict = Field(title="Portfolio dictionary")
