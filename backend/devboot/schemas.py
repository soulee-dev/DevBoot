from pydantic import BaseModel


class CodeIn(BaseModel):
    code: str


class Token(BaseModel):
    access_token: str
    token_type: str
