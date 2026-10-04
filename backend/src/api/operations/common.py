from sqlmodel import select

from api.dependencies import SessionDep
from api.models import BaseCreate, Movie


def get_or_create[T: BaseCreate](
    model: type[T], name: str, poster_url: str | None, session: SessionDep
) -> T:
    record = session.exec(select(model).where(model.name == name)).first()

    if record is None:
        record = (
            model(name=name, poster_url=poster_url)
            if model is Movie
            else model(name=name)
        )
        session.add(record)
        session.commit()
        session.refresh(record)

    return record
