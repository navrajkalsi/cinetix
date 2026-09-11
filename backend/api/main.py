from collections.abc import Sequence
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from api.database import get_session, init_db, remove_db
from api.models import (
    Booking,
    BookingCreate,
    BookingUpdate,
)
from api.operations import create, delete, get, get_all, update

SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield
    remove_db()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/bookings/")
def create_booking(data: BookingCreate, session: SessionDep) -> Booking:
    return create(data, session)


@app.get("/bookings/")
def read_bookings(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> Sequence[Booking]:
    return get_all(session, offset, limit)


@app.get("/bookings/{id}")
def read_booking(id: int, session: SessionDep) -> Booking:
    booking = get(id, session)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    return booking


@app.patch("/bookings/{id}")
def update_booking(id: int, data: BookingUpdate, session: SessionDep):
    booking = update(id, data, session)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    return booking


@app.delete("/bookings/{id}", status_code=204)
def delete_booking(id: int, session: SessionDep):
    booking = delete(id, session)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
