from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from ..dependencies.session import get_session_token, get_session_user
from ..models.user import (UserLoginSchema, UserModel, UserRegisterSchema,
                           UserUpdatePasswordSchema)
from ..services.session import create_session, destroy_session
from ..services.user import (UserRegisterError, create_user, get_password_hash,
                             update_password)
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

    password_hash = await get_password_hash(username)
    # Check password match or not
    if password_hash is None or not await validate_password(
        password, password_hash["hash"]
    ):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username or password incorrect! Please try again.",
            },
        )

    token = await create_session(password_hash["user_id"])
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

    hashed = await hash_password(password)

    try:
        user_id = await create_user(username, email, hashed)
    except UserRegisterError as error:
        return JSONResponse(status_code=400, content={"error": str(error)})

    return JSONResponse(
        status_code=201,
        content={"message": "Account created successfully.", "user_id": user_id},
    )


@router.get("/me", response_class=JSONResponse)
async def self_info(self_info: UserModel = Depends(get_session_user)):
    return JSONResponse(status_code=200, content=self_info.dict())


@router.put("/me", response_class=JSONResponse)
async def edit_info(
    edit: UserUpdatePasswordSchema, self_info: UserModel = Depends(get_session_user)
):
    username = self_info.dict()["username"]
    password = await get_password_hash(username)
    hashed = password["hash"]
    new_password = edit.new_password

    new_hashed = await hash_password(new_password)
    if await validate_password(new_password, hashed):
        return JSONResponse(
            status_code=400, content={"error": "User password duplicated!"}
        )

    try:
        await update_password(username, new_hashed)
    except Exception as error:
        return JSONResponse(status_code=400, content={"error": str(error)})

    return JSONResponse(
        status_code=200,
        content={
            "message": "User password updated successfully.",
        },
    )
