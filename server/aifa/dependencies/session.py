from bson import ObjectId
from fastapi import Depends
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
    payload = await read_session(token)
    return SessionToken.parse_obj(payload)


async def get_session_user(
    token: SessionToken = Depends(get_session_token_detail),
) -> UserModel:
    user_data = await user_collection.find_one({"user_id": ObjectId(token.user_id)})
    return UserModel(
        user_id=token.user_id,
        username=user_data.username,
        email=user_data.email,
        password_hash=user_data.password_hash,
    )
