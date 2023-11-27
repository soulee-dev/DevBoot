from sqlalchemy import Column, Integer, String
from .database import Base


class Code(Base):
    __tablename__ = "codes"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
