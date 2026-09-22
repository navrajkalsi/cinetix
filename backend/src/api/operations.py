from collections.abc import Sequence
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, select

from .database import get_session
from .models import (
    BaseCreate,
    Booking,
    BookingCreate,
    BookingRead,
    BookingUpdate,
    Format,
    Location,
    Movie,
)

SessionDep = Annotated[Session, Depends(get_session)]


def booking_read(booking: Booking, session: SessionDep) -> BookingRead:
    movie = get_movie(booking.movie_id, session)
    assert movie is not None
    location = get_location(booking.location_id, session)
    assert location is not None
    format = get_format(booking.format_id, session)
    assert format is not None

    return BookingRead.from_booking(booking, movie, location, format)


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
        datetime=data.datetime,
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


def get(id: int, session: SessionDep) -> BookingRead | None:
    booking = session.get(Booking, id)

    if booking is None:
        return None

    return booking_read(booking, session)


def get_all(session: SessionDep, offset: int, limit: int) -> Sequence[BookingRead]:
    bookings = session.exec(select(Booking).offset(offset).limit(limit)).all()

    return [booking_read(booking, session) for booking in bookings]


def update(id: int, data: BookingUpdate, session: SessionDep) -> BookingRead | None:
    booking = get(id, session)

    if booking:
        # retrieve only fields that are set in booking_update by the client
        # then update those in db booking
        _ = booking.sqlmodel_update(data.model_dump(exclude_unset=True))

        session.add(booking)
        session.commit()
        session.refresh(booking)

    return booking


def delete(id: int, session: SessionDep) -> BookingRead | None:
    booking = get(id, session)

    if booking:
        session.delete(booking)
        session.commit()

    return booking


def get_movie(id: int, session: SessionDep) -> Movie | None:
    return session.get(Movie, id)


def get_location(id: int, session: SessionDep) -> Location | None:
    return session.get(Location, id)


def get_format(id: int, session: SessionDep) -> Format | None:
    return session.get(Format, id)


def get_movies(session: SessionDep, offset: int, limit: int) -> Sequence[Movie]:
    return session.exec(select(Movie).offset(offset).limit(limit)).all()


def get_locations(session: SessionDep, offset: int, limit: int) -> Sequence[Location]:
    return session.exec(select(Location).offset(offset).limit(limit)).all()


def get_formats(session: SessionDep, offset: int, limit: int) -> Sequence[Format]:
    return session.exec(select(Format).offset(offset).limit(limit)).all()
