from pydantic import BaseModel, Field


class UserModel(BaseModel):
    user_id: str
    username: str
    email: str
    password_hash: str


class UserLoginSchema(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: str = Field(title="User password", max_length=20)


class UserRegisterSchema(UserLoginSchema):
    email: str = Field(title="User email", max_length=254)
    password_confirm: str = Field(title="Password confirmation", max_length=20)


class UserUpdatePasswordSchema(BaseModel):
    username: str = Field(title="Username", max_length=50)
    email: str | None = Field(title="User email", max_length=254)
    password: str = Field(title="User password", max_length=20)
