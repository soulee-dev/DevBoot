from sqlalchemy.orm import Session
from . import models, schemas


def get_code(db: Session, code: str):
    return db.query(models.Code).filter(models.Code.code == code).first()


def get_codes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Code).offset(skip).limit(limit).all()


def create_code(db: Session, code: schemas.CodeIn):
    db_code = models.Code(code=code.code)
    db.add(db_code)
    db.commit()
    db.refresh(db_code)
    return db_code
