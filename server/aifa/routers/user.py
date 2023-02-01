from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field

from ..services.database import user_collection
from ..services.session import create_session, destroy_session, read_session
from ..utils.password import hash_password, validate_password

router = APIRouter(prefix="/user", tags=["user"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class UserModel(BaseModel):
    username: str
    userId: str
    email: str


class LoginModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: str = Field(title="User password", max_length=20)


class RegisterModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str = Field(title="User email", max_length=254)
    password: str = Field(title="User password", max_length=20)
    password_confirm: str = Field(title="Password confirmation", max_length=20)


class UserEditModel(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str | None = Field(title="User email", max_length=254)
    password: bytes = Field(title="User password", max_length=20)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credential",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = read_session(token)
        if payload["userId"] is None:
            raise Exception()
        user_data = user_collection.find_one({"_id": ObjectId(payload["userId"])})
        if user_data is None:
            raise Exception()
    except Exception:
        raise credentials_exception

    return UserModel(
        userId=payload["userId"],
        username=user_data["username"],
        email=user_data["email"],
    )


@router.post("/login", response_class=JSONResponse)
async def login(login: LoginModel):
    username = login.username.strip()
    password = login.password

    if not username or not password:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Some fields are missing or invalid!",
            },
        )

    query = {"username": username}
    projection = {"_id": 1, "username": 1, "password": 1}
    userQuery = user_collection.find_one(query, projection)
    print(type(userQuery), "->", userQuery)
    if userQuery is None:
        # Username incorrect
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )

    password_hash = userQuery["password"]
    userId = str(userQuery["_id"])

    # Check password match or not
    if not await validate_password(password, password_hash):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )

    token = create_session(userId)
    return JSONResponse(status_code=200, content={"token": token})


@router.post("/logout", response_class=JSONResponse)
async def logout(token=Depends(oauth2_scheme)):
    try:
        destroy_session(token)
    except Exception:
        return JSONResponse(
            status_code=401, content={"error": "Token invalid or already expired."}
        )
    return JSONResponse(status_code=200, content={})


@router.post("/register", response_class=JSONResponse)
async def register(register: RegisterModel):
    username = register.username.strip()
    email = register.email
    password = register.password
    password_confirm = register.password_confirm
    if not (username and email and password and password_confirm):
        return JSONResponse(
            status_code=400,
            content={"error": "Some fields are missing or invalid!"},
        )

    # Check password and passwordConfirm
    if password != password_confirm:
        return JSONResponse(
            status_code=400,
            content={"error": "Password do not match!"},
        )
    if user_collection.find_one({"username": username}) is not None:
        return JSONResponse(
            status_code=400,
            content={"error": "Username repeated! Please create another username."},
        )
    if user_collection.find_one({"email": email}) is not None:
        return JSONResponse(
            status_code=400,
            content={"error": "Email repeated! Please type another email."},
        )

    hashed = await hash_password(password)
    new_user = {"username": username, "email": email, "password": hashed}
    insert_result = user_collection.insert_one(new_user)
    userId = str(insert_result.inserted_id)

    return JSONResponse(
        status_code=201,
        content={"message": "Account created successfully.", "userId": userId},
    )


# @router.post("/{userId}", response_class=JSONResponse)
# async def edit(edit: UserEditModel, userId: str = Path(title="User ID")):
#     userId = ObjectId(userId)
#     query = {"_id": userId}
#     projection = {"_id": 0, "username": 1, "password": 1}
#     user_info = user_collection.find_one(query, projection)
#     username = user_info["username"]
#     password = user_info["password"]

#     new_username = edit.username
#     new_password = edit.password
#     new_salt = bcrypt.gensalt(16)
#     new_hashed_password = hash_password(new_password, new_salt)

#     # Check if username and password is empty
#     if len(new_username) == 0 and len(new_password) == 0:
#         return JSONResponse(
#             status_code=400,
#             content={
#                 "error": "Some fields are missing or invalid!",
#             },
#         )
#     # Check if user is logged in
#     # if userInfo.count() == 0:
#     #     return JSONResponse(
#     #         status_code=401, content="User is unauthorized to update account."
#     #     )

#     # Check if username is repeated with the original one
#     if username == new_username:
#         return JSONResponse(
#             status_code=400,
#             content={
#                 "error": "Username repeated! Please change another username.",
#             },
#         )
#     # Check if the password is repeated with the original one
#     if bcrypt.checkpw(new_password, password):
#         return JSONResponse(
#             status_code=400,
#             content={
#                 "error": "Password repeated! Please change another password.",
#             },
#         )

#     # Update username and hashed password in
#     new_values = {
#         "$set": {
#             "username": new_username,
#             "password": new_hashed_password,
#             "salt": new_salt,
#         }
#     }
#     user_collection.update_one(query, new_values)
#     return JSONResponse(status_code=200)


# @router.get("/{userId}", response_class=JSONResponse)
# async def info(userId: str = Path(title="User ID")):
#     userId = ObjectId(userId)
#     query = {"_id": userId}
#     projection = {"_id": 0, "username": 1, "email": 1}
#     user_info = user_collection.find_one(query, projection)
#     username = user_info["username"]
#     email = user_info["email"]

#     return JSONResponse(
#         status_code=200,
#         content={"username": username, "email": email},
#     )
