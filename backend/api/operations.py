from collections.abc import Sequence
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, select

from api.database import get_session
from api.models import (
    BaseCreate,
    Booking,
    BookingCreate,
    BookingUpdate,
    Format,
    Location,
    Movie,
)

SessionDep = Annotated[Session, Depends(get_session)]


def get_or_create[T: BaseCreate](model: type[T], name: str, session: SessionDep) -> T:
    record = session.exec(select(model).where(model.name == name)).first()

    if record is None:
        record = model(name=name)
        session.add(record)
        session.commit()
        session.refresh(record)

    return record


def create(data: BookingCreate, session: SessionDep) -> Booking:
    movie_id = get_or_create(Movie, data.movie, session).id
    location_id = get_or_create(Location, data.location, session).id
    format_id = get_or_create(Format, data.format, session).id

    # silence type checks
    assert movie_id is not None
    assert location_id is not None
    assert format_id is not None

    # validated full booking object, with unique id
    booking = Booking(
        booking_id=data.booking_id,
        date=data.date,
        time=data.time,
        seats=data.seats,
        price=data.price,
        movie_id=movie_id,
        location_id=location_id,
        format_id=format_id,
    )

    session.add(booking)
    session.commit()
    session.refresh(booking)

    return booking


def get(id: int, session: SessionDep) -> Booking | None:
    return session.get(Booking, id)


def get_all(session: SessionDep, offset: int, limit: int) -> Sequence[Booking]:
    return session.exec(select(Booking).offset(offset).limit(limit)).all()


def update(id: int, data: BookingUpdate, session: SessionDep) -> Booking | None:
    booking = get(id, session)

    if booking:
        # retrieve only fields that are set in booking_update by the client
        # then update those in db booking
        _ = booking.sqlmodel_update(data.model_dump(exclude_unset=True))

        session.add(booking)
        session.commit()
        session.refresh(booking)

    return booking


def delete(id: int, session: SessionDep) -> Booking | None:
    booking = get(id, session)

    if booking:
        session.delete(booking)
        session.commit()

    return booking
