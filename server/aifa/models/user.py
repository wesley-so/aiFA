from pydantic import BaseModel, Field


class UserModel(BaseModel):
    user_id: str = Field(title="User ID", max_length=32)
    username: str = Field(title="Username", max_length=50)
    email: str = Field(title="Email", max_length=254)


class UserWithPasswordModel(UserModel):
    password_hash: str


class UserLoginSchema(BaseModel):
    username: str = Field(title="Username", max_length=50)
    password: str = Field(title="User password", max_length=20)


class UserRegisterSchema(UserLoginSchema):
    email: str = Field(title="Email", max_length=254)
    password_confirm: str = Field(title="Password confirmation", max_length=20)


class UserUpdatePasswordSchema(BaseModel):
    new_password: str = Field(title="User new password", max_length=20)
    confirm_new_password: str = Field(title="Confirm new password", max_length=20)
