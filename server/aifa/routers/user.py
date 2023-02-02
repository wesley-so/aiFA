from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from ..dependencies.session import get_session_token, get_session_user
from ..models.user import UserLoginSchema, UserModel, UserRegisterSchema
from ..services.database import user_collection
from ..services.session import create_session, destroy_session
from ..utils.password import hash_password, validate_password

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/login", response_class=JSONResponse)
async def login(login: UserLoginSchema):
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
    projection = {"_id": 1, "username": 1, "password_hash": 1}
    userQuery = await user_collection.find_one(query, projection)
    print(type(userQuery), "->", userQuery)
    if userQuery is None:
        # Username incorrect
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )

    password_hash = userQuery["password_hash"]
    user_id = str(userQuery["_id"])

    # Check password match or not
    if not await validate_password(password, password_hash):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )

    token = await create_session(user_id)
    return JSONResponse(status_code=200, content={"token": token})


@router.post("/logout", response_class=JSONResponse)
async def logout(token=Depends(get_session_token)):
    try:
        await destroy_session(token)
    except Exception:
        return JSONResponse(
            status_code=401, content={"error": "Token invalid or already expired."}
        )
    return JSONResponse(status_code=200, content={})


@router.post("/register", response_class=JSONResponse)
async def register(register: UserRegisterSchema):
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

    repeated_user = await user_collection.find_one(
        {"$or": [{"username": username}, {"email": email}]}
    )
    if repeated_user is not None:
        if username == repeated_user["username"]:
            error_msg = "Username repeated! Please create another username."
        else:
            error_msg = "Email repeated! Please type another email."
        return JSONResponse(status_code=400, content={"error": error_msg})

    hashed = await hash_password(password)
    new_user = {"username": username, "email": email, "password_hash": hashed}
    insert_result = await user_collection.insert_one(new_user)
    user_id = str(insert_result.inserted_id)

    return JSONResponse(
        status_code=201,
        content={"message": "Account created successfully.", "user_id": user_id},
    )


@router.get("/me", response_class=JSONResponse)
async def self_info(self_info: UserModel = Depends(get_session_user)):
    return JSONResponse(status_code=200, content=self_info.dict())
