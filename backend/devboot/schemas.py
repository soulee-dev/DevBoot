from pydantic import BaseModel


class CodeIn(BaseModel):
    code: str


class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    email: str
    username: str
    password: str
    class Config:
        orm_mode = True