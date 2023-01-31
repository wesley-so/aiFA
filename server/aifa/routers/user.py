import bcrypt
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, Path
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from pymongo import MongoClient
import os
from ..service.jwt import decodeJWT, expireJWT, signJWT

router = APIRouter(prefix="/user", tags=["user"])
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")
conn = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/")
db = conn.aifa
userCol = db.user
session = db.session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class UserModel(BaseModel):
    username: str
    userId: str
    email: str


class LoginModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: bytes = Field(title="User password", max_length=20)


class RegisterModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str = Field(title="User email", max_length=254)
    password: bytes = Field(title="User password", max_length=20)
    password_confirm: bytes = Field(title="Password confirmation", max_length=20)


class UserEditModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str | None = Field(title="User email", max_length=254)
    password: bytes = Field(title="User password", max_length=20)


# Hash password function
async def hash_password(password, salt):
    return bcrypt.hashpw(password=password, salt=salt)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = JSONResponse(
        status_code=401,
        content="Could not validate credential",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decodeJWT(token)
        userId = payload["userId"]
        if userId is None:
            raise credentials_exception
    except Exception as error:
        return error
    user_data = userCol.find_one({"_id": ObjectId(userId)})
    if user_data is None:
        raise credentials_exception
    user = UserModel(
        username=user_data["username"], userId=userId, email=user_data["email"]
    )
    return user


@router.post("/login", response_class=JSONResponse)
async def login(login: LoginModel):
    username = login.username
    password = login.password

    if len(username) == 0 or len(password) == 0:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Some fields are missing or invalid!",
            },
        )

    query = {"username": username}
    projection = {"_id": 1, "username": 1, "password": 1}
    userQuery = userCol.find_one(query, projection)
    print(userQuery)
    if userQuery == 0:
        # Username incorrect
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )
    else:
        user_password = userQuery["password"]
        userId = str(userQuery["_id"])

    # Check password match or not
    if bcrypt.checkpw(password, user_password):
        token = signJWT(userId)
        session.insert_one({"token": token}, True)
        return JSONResponse(status_code=200, content={"token": token})
    else:
        # Password incorrect
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )


@router.post("/logout", response_class=JSONResponse)
async def logout(token):
    expireJWT(token)


@router.post("/register", response_class=JSONResponse)
async def register(register: RegisterModel):
    username = register.username
    email = register.email
    password = register.password
    password_confirm = register.password_confirm
    if (
        len(username) == 0
        or len(email) == 0
        or len(password) == 0
        or len(password_confirm) == 0
    ):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Some fields are missing or invalid!",
            },
        )

    # Check password and passwordConfirm
    if password != password_confirm:
        return JSONResponse(
            status_code=400,
            content={"error": "Password do not match!"},
        )

    if userCol.find_one({"username": username}) is not None:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username repeated! Please create another username.",
            },
        )
    if userCol.find_one({"email": email}) is not None:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Email repeated! Please type another email.",
            },
        )

    salt = bcrypt.gensalt(16)
    hashed = hash_password(password, salt)
    new_user = {"username": username, "email": email, "password": hashed, "salt": salt}
    insert_user = userCol.insert_one(new_user)
    userId = insert_user.inserted_id

    return JSONResponse(
        status_code=201,
        content={
            "message": f"Account created successfully! ID: {userId}",
        },
    )


@router.post("/{userId}", response_class=JSONResponse)
async def edit(edit: UserEditModel, userId: str = Path(title="User ID")):
    userId = ObjectId(userId)
    query = {"_id": userId}
    projection = {"_id": 0, "username": 1, "password": 1}
    user_info = userCol.find_one(query, projection)
    username = user_info["username"]
    password = user_info["password"]

    new_username = edit.username
    new_password = edit.password
    new_salt = bcrypt.gensalt(16)
    new_hashed_password = hash_password(new_password, new_salt)

    # Check if username and password is empty
    if len(new_username) == 0 and len(new_password) == 0:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Some fields are missing or invalid!",
            },
        )
    # Check if user is logged in
    # if userInfo.count() == 0:
    #     return JSONResponse(
    #         status_code=401, content="User is unauthorized to update account."
    #     )

    # Check if username is repeated with the original one
    if username == new_username:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username repeated! Please change another username.",
            },
        )
    # Check if the password is repeated with the original one
    if bcrypt.checkpw(new_password, password):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Password repeated! Please change another password.",
            },
        )

    # Update username and hashed password in
    new_values = {
        "$set": {
            "username": new_username,
            "password": new_hashed_password,
            "salt": new_salt,
        }
    }
    userCol.update_one(query, new_values)
    return JSONResponse(status_code=200)


@router.get("/{userId}", response_class=JSONResponse)
async def info(userId: str = Path(title="User ID")):
    userId = ObjectId(userId)
    query = {"_id": userId}
    projection = {"_id": 0, "username": 1, "email": 1}
    user_info = userCol.find_one(query, projection)
    username = user_info["username"]
    email = user_info["email"]

    return JSONResponse(
        status_code=200,
        content={"username": username, "email": email},
    )
