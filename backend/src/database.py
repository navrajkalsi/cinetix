import os

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

if load_dotenv() is False:
    raise FileNotFoundError(".env file not found")

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise OSError("DATABASE_URL not set")

engine = create_engine(DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)


def remove_db():
    SQLModel.metadata.drop_all(engine)
