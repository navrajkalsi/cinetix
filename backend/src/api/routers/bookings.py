from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from api.dependencies import SessionDep
from api.models.bookings import BookingCreate, BookingRead
from api.operations.bookings import (
    create_booking,
    read_booking,
    read_bookings,
    remove_booking,
)

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
    responses={404: {"description": "Booking Not Found"}},
)


@router.get("/{id}")
def get_booking(id: int, session: SessionDep) -> BookingRead:
    """Retrieves the booking with provided ID."""

    booking = read_booking(id, session)

    if booking is None:
        raise HTTPException(status_code=404)

    return booking


@router.get("/")
def get_bookings(
    session: SessionDep,
    year: Annotated[
        int | None, Query(description="Year the returned booking should be from.")
    ] = None,
    movie_id: Annotated[
        int | None, Query(description="Return bookings for only certain movie.")
    ] = None,
    location_id: Annotated[
        int | None, Query(description="Return bookings for only certain location.")
    ] = None,
    format_id: Annotated[
        int | None, Query(description="Return bookings for only certain format.")
    ] = None,
    include_future: Annotated[
        bool,
        Query(
            description="Include bookings from future years as well with the current `year`. If `year` is not provided, this filter is ignored."
        ),
    ] = False,
) -> Sequence[BookingRead]:
    """Returns the list of all bookings in the database that satisfy the supplied filters."""

    return read_bookings(
        year, movie_id, location_id, format_id, session, include_future
    )


@router.post("/")
def post_booking(model: BookingCreate, session: SessionDep) -> BookingRead:
    """Adds a new booking row in the database."""

    return create_booking(model, session)


@router.delete("/{id}", status_code=204)
def delete_booking(id: int, session: SessionDep):
    """Removes a row from the booking table from its ID."""

    booking = remove_booking(id, session)

    if booking is None:
        raise HTTPException(status_code=404)
