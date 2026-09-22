from sqlmodel import Session, SQLModel, create_engine

from .config import settings

engine = create_engine(settings.database_url)


def get_session():
    # ensures that we get a session and do not have multiple connections open to the db
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)


def remove_db():
    SQLModel.metadata.drop_all(engine)
