import bcrypt
from fastapi import APIRouter, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pymongo import MongoClient
import os

router = APIRouter(prefix="/user", tags=["user"])
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")
conn = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}")
db = conn["aifa"]
userCol = db["user"]


class LoginModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: str = Field(title="User password", max_length=20)


class RegisterModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str = Field(title="User email", max_length=254)
    password: str = Field(title="User password", max_length=20)
    passwordConfirm: str = Field(title="Password confirmation", max_length=20)


class UserModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str | None = Field(title="User email", max_length=254)
    password: str = Field(title="User password", max_length=20)


# Hash password function
def hash_password(password_bytes, salt):
    return bcrypt.hashpw(password=password_bytes, salt=salt)


@router.post("/login", response_class=JSONResponse)
async def login(login: LoginModel):
    if login.username.__len__ == 0 or login.password.__len__ == 0:
        return JSONResponse(
            status_code=400, content="Some fields are missing or invalid!"
        )

    username = login.username
    password = login.password

    query = {"username": username}
    userQuery = userCol.find(query)

    # Check if the username is empty
    if userQuery.count() == 0:
        return JSONResponse(
            status_code=400, content="Username or password incorrect! Please try again."
        )

    # Check password match or not
    if bcrypt.checkpw(password, userQuery.password):
        return JSONResponse(status_code=200, content="Login successfully!")
    else:
        return JSONResponse(
            status_code=400, content="Username or password incorrect! Please try again."
        )


@router.post("/logout")
async def logout():
    return


@router.post("/register", response_class=JSONResponse)
async def register(register: RegisterModel):
    if (
        register.username.__len__ == 0
        or register.email.__len__ == 0
        or register.password.__len__ == 0
        or register.passwordConfirm.__len__ == 0
    ):
        return JSONResponse(
            status_code=400, content="Some fields are missing or invalid!"
        )
    username = register.username
    email = register.email
    password = register.password
    passwordConfirm = register.passwordConfirm

    # Check password and passwordConfirm
    if password != passwordConfirm:
        return JSONResponse(status_code=400, content="Password do not match!")

    # Check if the collection have this username
    for i in userCol.find():
        if username == i.username:
            return JSONResponse(
                status_code=400,
                content="Username repeated! Please create another username.",
            )
        if email == i.email:
            return JSONResponse(
                status_code=400, content="Email repeated! Please type another email."
            )
    salt = bcrypt.gensalt(16)
    hashed = hash_password(password, salt)
    newUser = {"username": username, "email": email, "password": hashed, "salt": salt}
    insertUser = userCol.insert_one(newUser)
    return JSONResponse(
        status_code=201,
        content=f"Account created successfully! ID: {insertUser.inserted_id}",
    )


@router.post("/{userId}", response_class=JSONResponse)
async def edit(edit: UserModel, userId: int = Path(title="User ID")):
    query = {"_id": userId}
    userInfo = userCol.find(query)
    new_username = edit.username
    new_password = edit.password

    if new_username.__len__ == 0 and new_password.__len__ == 0:
        return JSONResponse(
            status_code=400, content="Some fields are missing or invalid!"
        )

    if userInfo.count() == 0:
        return JSONResponse(
            status_code=401, content="User is unauthorized to update account."
        )
    else:
        if userInfo.username == new_username:
            return JSONResponse(
                status_code=400,
                content="Username repeated! Please change another username.",
            )
        if bcrypt.checkpw(new_password, userInfo.password):
            return JSONResponse(
                status_code=400,
                content="Password repeated! Please change another password.",
            )
        newValues = {"$set": {"username": new_username, "password": new_password}}
        userCol.update_one(query, newValues)


@router.get("/{userId}", response_class=JSONResponse)
async def info(userId: int = Path(title="User ID")):
    query = {"_id": userId}
    userInfo = userCol.find(query)
    username = userInfo.username
    email = userInfo.email

    if userInfo.count() == 0:
        return JSONResponse(
            status_code=401, content="User is unauthorized to get account information."
        )
    else:
        return JSONResponse(
            status_code=200, content=f"Username: {username} \n Email: {email}"
        )
