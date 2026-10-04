from collections.abc import Sequence

from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Booking, BookingCreate, BookingRead, BookingUpdate
from api.operations.bookings import (
    create_booking,
    read_booking,
    read_bookings,
    remove_booking,
    update_booking,
)

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
    responses={404: {"description": "Booking Not Found"}},
)


@router.post("/")
def post_booking(model: BookingCreate, session: SessionDep) -> Booking:
    return create_booking(model, session)


@router.get("/{id}")
def get_booking(id: int, session: SessionDep) -> BookingRead:
    booking = read_booking(id, session)

    if booking is None:
        raise HTTPException(status_code=404)

    return booking


@router.get("/")
def get_bookings(
    session: SessionDep,
    year: int | None = None,
    movie: int | None = None,
    location: int | None = None,
    format: int | None = None,
    future: bool = False,
) -> Sequence[BookingRead]:
    return read_bookings(year, movie, location, format, session, future)


@router.patch("/{id}")
def patch_booking(id: int, model: BookingUpdate, session: SessionDep) -> BookingRead:
    booking = update_booking(id, model, session)

    if booking is None:
        raise HTTPException(status_code=404)

    return booking


@router.delete("/{id}", status_code=204)
def delete_booking(id: int, session: SessionDep):
    booking = remove_booking(id, session)

    if booking is None:
        raise HTTPException(status_code=404)
