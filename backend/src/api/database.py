from sqlmodel import Session, SQLModel, create_engine

from api.operations.seed import seed_formats
from config import config

engine = create_engine(config.database_url)


def get_session():
    # ensures that we get a session and do not have multiple connections open to the db
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_formats(session)


def remove_db():
    SQLModel.metadata.drop_all(engine)
