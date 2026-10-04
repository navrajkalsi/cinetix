from collections.abc import Sequence
from datetime import datetime

from sqlmodel import desc, select

from api.dependencies import SessionDep
from api.models import (
    Booking,
    BookingCreate,
    BookingRead,
    BookingUpdate,
    Format,
    Location,
    Movie,
)
from api.operations.common import get_or_create
from api.operations.formats import read_format
from api.operations.locations import read_location
from api.operations.movies import read_movie

# Current time in locale timezone
now = datetime.now().astimezone()


def into_booking_read(booking: Booking, session: SessionDep) -> BookingRead:
    movie = read_movie(booking.movie_id, session)
    location = read_location(booking.location_id, session)
    format = read_format(booking.format_id, session)

    assert movie is not None and location is not None and format is not None

    return BookingRead.from_booking(booking, movie, location, format)


def create_booking(model: BookingCreate, session: SessionDep) -> Booking:
    """Creates a new booking record in the database.

    Translates supplied `model` to a new `Booking` by using or creating new entries for `Movie`,
    `Location` and `Format`.
    """

    movie_id = get_or_create(Movie, model.movie, model.movie_poster_url, session).id
    location_id = get_or_create(Location, model.location, None, session).id
    format_id = get_or_create(Format, model.format, None, session).id

    # silence none type checks
    assert movie_id is not None and location_id is not None and format_id is not None

    # validated full booking object, with unique id
    booking = Booking(
        booking_id=model.booking_id,
        datetime=model.datetime,
        seats=model.seats,
        price=model.price,
        movie_id=movie_id,
        location_id=location_id,
        format_id=format_id,
    )

    session.add(booking)
    session.commit()
    session.refresh(booking)

    return booking


def read_booking(id: int, session: SessionDep) -> BookingRead | None:
    """Returns the booking with the provided `id`, if found."""

    booking = session.get(Booking, id)

    if booking is None:
        return None

    return into_booking_read(booking, session)


def read_bookings(
    year: int | None,
    movie_id: int | None,
    location_id: int | None,
    format_id: int | None,
    session: SessionDep,
    include_future: bool = False,
) -> Sequence[BookingRead]:
    """Returns all the bookings that satisfy the supplied filters.

    Args:
        year: Year the returned bookings should be from.
            If no `year` is provided, bookings from all years are returned.
        movie_id: Return bookings for only certain movie.
        location_id: Return bookings for only certain location.
        format_id: Return bookings for only certain format.
        include_future: Flag to include bookings from future years as well with the current `year`.
            If `year` is not provided, this flag is ignored.

    Returns:
        A sequence of bookings that satisfy all the provided filters,
        ordered by the date and time of the booking.
        The sequence may be empty if no entries satisfy the filters.
    """

    statement = select(Booking)

    if year:
        if include_future:
            statement = statement.where(
                Booking.datetime >= datetime(year, 1, 1, tzinfo=now.tzinfo),
            )
        else:
            statement = statement.where(
                Booking.datetime >= datetime(year, 1, 1, tzinfo=now.tzinfo),
                Booking.datetime < datetime(year + 1, 1, 1, tzinfo=now.tzinfo),
            )

    if movie_id:
        statement = statement.where(Booking.movie_id == movie_id)
    if location_id:
        statement = statement.where(Booking.location_id == location_id)
    if format_id:
        statement = statement.where(Booking.format_id == format_id)

    # order
    bookings = session.exec(statement.order_by(desc(Booking.datetime))).all()

    return [into_booking_read(booking, session) for booking in bookings]


def update_booking(
    id: int, model: BookingUpdate, session: SessionDep
) -> BookingRead | None:
    """Updates the booking in database with `id` to the fields of provided `model`.

    Args:
        id: ID of the booking to update.
        model: Updated model with changes.

    Returns:
        Updated version of the booking on success or `None` if no booking was found with the
        requested `id`.
    """

    booking = read_booking(id, session)

    if booking is not None:
        # retrieve only fields that are set in booking_update by the client
        # then update those in db booking
        _ = booking.sqlmodel_update(model.model_dump(exclude_unset=True))

        session.add(booking)
        session.commit()
        session.refresh(booking)

    return booking


def remove_booking(id: int, session: SessionDep) -> BookingRead | None:
    """Deletes the requested booking from the database.

    Args:
        id: ID of the booking to delete.

    Returns:
        Removed booking on success or `None` if no booking was found with the requested `id`.
    """

    booking = read_booking(id, session)

    if booking is not None:
        session.delete(booking)
        session.commit()

    return booking
