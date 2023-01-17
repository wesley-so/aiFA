import bcrypt
from bson.objectid import ObjectId
from fastapi import APIRouter, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pymongo import MongoClient
import os

router = APIRouter(prefix="/user", tags=["user"])
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")
conn = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/")
db = conn.aifa
userCol = db.user
session = db.session


class LoginModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: bytes = Field(title="User password", max_length=20)


class RegisterModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str = Field(title="User email", max_length=254)
    password: bytes = Field(title="User password", max_length=20)
    passwordConfirm: bytes = Field(title="Password confirmation", max_length=20)


class UserModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str | None = Field(title="User email", max_length=254)
    password: bytes = Field(title="User password", max_length=20)


# Hash password function
def hash_password(password, salt):
    return bcrypt.hashpw(password=password, salt=salt)


@router.post("/login", response_class=JSONResponse)
async def login(login: LoginModel):
    username = login.username
    password = login.password

    query = {"username": username}
    projection = {"_id": 0, "username": 1, "password": 1}
    userQuery = userCol.find(query, projection)
    for i in userQuery:
        user_password = i["password"]

    # Check if the username matches the database data
    if userCol.count_documents(query) == 0:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Username or password incorrect! Please try again.",
            },
        )
    # Check password match or not
    if bcrypt.checkpw(password, user_password):
        return JSONResponse(status_code=200, content="Login successfully!")
    else:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Username or password incorrect! Please try again.",
            },
        )


@router.post("/logout")
async def logout():
    return


@router.post("/register", response_class=JSONResponse)
async def register(register: RegisterModel):
    if (
        register.username.count() == 0
        or register.email.count() == 0
        or register.password.count() == 0
        or register.passwordConfirm.count() == 0
    ):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Some fields are missing or invalid!",
            },
        )
    username = register.username
    email = register.email
    password = register.password
    passwordConfirm = register.passwordConfirm

    # Check password and passwordConfirm
    if password != passwordConfirm:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "Password do not match!"},
        )

    if userCol.count_documents({}) != 0:
        # if userCol.find({"username": {"$eq": {username}}}) > 0:
        if userCol.count_documents({"username": {username}}) > 0:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Username repeated! Please create another username.",
                },
            )
        # if userCol.find({"email": {"$eq": {email}}}).count() > 0:
        if userCol.count_documents({"email": {email}}) > 0:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Email repeated! Please type another email.",
                },
            )

    salt = bcrypt.gensalt(16)
    hashed = hash_password(password, salt)
    newUser = {"username": username, "email": email, "password": hashed, "salt": salt}
    insertUser = userCol.insert_one(newUser)
    return JSONResponse(
        status_code=201,
        content={
            "success": True,
            "message": f"Account created successfully! ID: {insertUser.inserted_id}",
        },
    )


@router.post("/{userId}", response_class=JSONResponse)
async def edit(edit: UserModel, userId: str = Path(title="User ID")):
    query = {"_id": userId}
    projection = {"_id": 0, "username": 1, "password": 1}
    userInfo = userCol.find_one(query, projection)
    for i in userInfo:
        username = i["username"]
        password = i["password"]
    new_username = edit.username
    new_password = edit.password
    new_salt = bcrypt.gensalt(16)
    new_hashed_password = hash_password(new_password, new_salt)

    # Check if username and password is empty
    if new_username.count() == 0 and new_password.count() == 0:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Some fields are missing or invalid!",
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
                "success": False,
                "message": "Username repeated! Please change another username.",
            },
        )
    # Check if the password is repeated with the original one
    if bcrypt.checkpw(new_password, password):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Password repeated! Please change another password.",
            },
        )

    # Update username and hashed password in
    newValues = {
        "$set": {
            "username": new_username,
            "password": new_hashed_password,
            "salt": new_salt,
        }
    }
    userCol.update_one(query, newValues)
    return JSONResponse(
        status_code=200,
        content={"success": True, "message": "User info updated successfully!"},
    )


@router.get("/{userId}", response_class=JSONResponse)
async def info(userId: str = Path(title="User ID")):
    userId = ObjectId(userId)
    query = {"_id": userId}
    projection = {"_id": 0, "username": 1, "email": 1}
    userInfo = userCol.find(query, projection)
    for i in userInfo:
        username = i["username"]
        email = i["email"]

    return JSONResponse(
        status_code=200,
        content={"success": True, "message": f"Username: {username}, Email: {email}"},
        # headers={"username": username, "email": email}
    )
