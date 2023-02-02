from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from ..models.session import SessionToken
from ..models.user import UserModel
from ..services.database import user_collection
from ..services.session import read_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")


async def get_session_token(token: str = Depends(oauth2_scheme)) -> str:
    return token


async def get_session_token_detail(
    token: str = Depends(get_session_token),
) -> SessionToken:
    try:
        payload = await read_session(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Session invalid or expired.")
    return SessionToken.parse_obj(payload)


async def get_session_user(
    token: SessionToken = Depends(get_session_token_detail),
) -> UserModel:
    print(token)
    user_data = await user_collection.find_one({"_id": ObjectId(token.user_id)})
    if user_data is None:
        raise HTTPException(status_code=500, detail="Fatal: User not found.")
    user_data["user_id"] = str(user_data.pop("_id"))
    return UserModel.parse_obj(user_data)
