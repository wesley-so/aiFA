from datetime import datetime

from pydantic import BaseModel


class SessionToken(BaseModel):
    user_id: str
    session_id: str
    nbf: datetime
    exp: datetime
