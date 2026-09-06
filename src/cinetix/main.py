from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session, SQLModel, select

from cinetix.database import get_session, init_db, remove_db
from cinetix.models import (
    Booking,
    BookingCreate,
    Format,
    Location,
    Movie,
)

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


def get_or_create[T: SQLModel](model: type[T], name: str, session: SessionDep) -> T:
    record = session.exec(select(model).where(model.name == name)).first()

    if record is None:
        record = model(name=name)
        session.add(record)
        session.commit()
        session.refresh(record)

    return record


@app.on_event("startup")  # pyright: ignore[reportDeprecated]
async def startup():
    init_db()


@app.on_event("shutdown")  # pyright: ignore[reportDeprecated]
async def shutdown():
    remove_db()


@app.post("/bookings/", response_model=Booking)
def create_booking(booking_create: BookingCreate, session: SessionDep) -> Booking:
    movie = get_or_create(Movie, booking_create.movie, session)
    location = get_or_create(Location, booking_create.location, session)
    format = get_or_create(Format, booking_create.format, session)

    # validated full booking object, with unique id
    booking = Booking(
        booking_id=booking_create.booking_id,
        date=booking_create.date,
        time=booking_create.time,
        seats=booking_create.seats,
        price=booking_create.price,
        movie=movie.id,
        location=location.id,
        format=format.id,
    )

    session.add(booking)
    session.commit()
    session.refresh(booking)

    return booking


@app.get("/bookings/")
def read_bookings(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> list[Booking]:
    bookings = session.exec(select(Booking).offset(offset).limit(limit)).all()

    return bookings


@app.get("/bookings/{booking_id}")
def read_booking(booking_id: int, session: SessionDep) -> Booking:
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return booking


@app.patch("/bookings/{booking_id}")
def update_booking(booking_id: int, booking_create: BookingCreate, session: SessionDep):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking_create.movie = get_or_create(Movie, booking_create.movie, session).id
    booking_create.location = get_or_create(
        Location, booking_create.location, session
    ).id
    booking_create.format = get_or_create(Format, booking_create.format, session).id

    booking.sqlmodel_update(booking_create.model_dump(exclude_unset=True))

    session.add(booking)
    session.commit()
    session.refresh(booking)

    return booking


@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, session: SessionDep):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    session.delete(booking)
    session.commit()

    return {"ok": True}
