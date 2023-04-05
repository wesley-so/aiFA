from bson import ObjectId

from aifa.models.user import UserModel

from .database import client, user_collection


class UserRegisterError(Exception):
    pass


async def query_raw_user(
    filter, with_password_hash: bool = False, session=None
) -> dict | None:
    projection = None
    if with_password_hash:
        projection = {"password_hash": 1}

    user_data = await user_collection.find_one(filter, projection, session=session)
    if user_data is None:
        return None

    user_data["user_id"] = str(user_data.pop("_id"))
    return user_data


async def get_user_by_id(user_id: str) -> UserModel | None:
    user_data = await query_raw_user({"_id": ObjectId(user_id)})
    if user_data is None:
        return None
    return UserModel.parse_obj(user_data)


async def get_user_by_name(username: str) -> UserModel | None:
    user_data = await query_raw_user({"username": username})
    if user_data is None:
        return None
    return UserModel.parse_obj(user_data)


async def create_user(username, email, password_hash) -> str:
    async with await client.start_session() as s:
        async with s.start_transaction():
            user = await query_raw_user(
                {"$or": [{"username": username}, {"email": email}]}, session=s
            )

            if user is not None:
                if username == user["username"]:
                    reason = "Username has been taken."
                else:
                    reason = "This email already registered with an account."
                raise UserRegisterError(reason)

            result = await user_collection.insert_one(
                {"username": username, "email": email, "password_hash": password_hash},
                session=s,
            )
    return str(result.inserted_id)


async def get_password_hash(username: str):
    user_data = await query_raw_user({"username": username}, with_password_hash=True)
    if user_data is None:
        return None
    return {"user_id": user_data["user_id"], "hash": user_data["password_hash"]}


async def update_password(username: str, new_password: str):
    async with await client.start_session() as s:
        async with s.start_transaction():
            user = await get_user_by_name(username)
            if user is None:
                return None
            await user_collection.update_one(
                {"username": user.username},
                {"$set": {"password_hash": new_password}},
                session=s,
            )
