import json
import os
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
import string
import random
from datetime import datetime, timedelta
from . import crud, models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import requests
from jose import jwt
from fastapi import Response


load_dotenv()

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_HOSTS").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def authenticate_user(code: str, db: Session):
    db_code = crud.get_code(db, code=code)
    if not db_code:
        return False
    return db_code


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=ALGORITHM)
    return encoded_jwt

class TokenData(BaseModel):
    email: str | None = None

async def is_jwt_valid(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[ALGORITHM])
        return True
    except jwt.ExpiredSignatureError:
        # Handle expired token
        return False
    except jwt.JWTError:
        return False


def generate_random_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return "".join(random.choice(characters) for i in range(length))


@app.on_event("startup")
async def startup_event():
    random_code = generate_random_code()
    print(f"Generated Code: {random_code}")
    code_data = schemas.CodeIn(code=random_code)
    crud.create_code(db=SessionLocal(), code=code_data)


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    code_in: schemas.CodeIn, db: Session = Depends(get_db)
):
    user = authenticate_user(code_in.code, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": code_in.code}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register(user: schemas.User, valid_jwt: bool = Depends(is_jwt_valid)):
    if not valid_jwt:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT",
            headers={"WWW-Authenticate": "Bearer"},

        )
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Coder-Session-Token": f"{os.getenv('CODER_TOKEN')}"
    }

    data = {
        "email": user.email,
        "username": user.username,
        "password": user.password
    }

    json_data = json.dumps(data)


    res = requests.post(f"{os.getenv('CODER_API_URL')}/api/v2/users", headers=headers, data=json_data)

    return Response(content=res.text, status_code=res.status_code, media_type="application/json")
