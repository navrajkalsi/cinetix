from collections.abc import Sequence
from datetime import date

from sqlmodel import desc, select

from api.dependencies import SessionDep
from api.models.bookings import Booking, BookingCreate, BookingRead, BookingSeed
from api.models.locations import LocationCreate
from api.models.movies import MovieCreate
from api.operations.formats import create_format
from api.operations.locations import create_location
from api.operations.movies import create_movie
from maps.client import search_place
from tmdb.client import search_movie


def read_booking(id: int, session: SessionDep) -> BookingRead | None:
    """Returns the booking with the provided `id`, if found."""

    return BookingRead.model_validate(session.get(Booking, id))


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
        include_future: Flag to include bookings from future years as well with the provided `year`.
            If `year` is not provided, this flag is ignored.

    Returns:
        A sequence of bookings that satisfy all the provided filters,
        ordered by the date and time of the booking.
        The sequence may be empty if no entries satisfy the filters.
    """

    statement = select(Booking)

    if year:
        if include_future:
            statement = statement.where(Booking.date >= date(year, 1, 1))
        else:
            statement = statement.where(
                Booking.date >= date(year, 1, 1),
                Booking.date < date(year + 1, 1, 1),
            )

    if movie_id:
        statement = statement.where(Booking.movie_id == movie_id)
    if location_id:
        statement = statement.where(Booking.location_id == location_id)
    if format_id:
        statement = statement.where(Booking.format_id == format_id)

    # order
    bookings = session.execute(statement.order_by(desc(Booking.date))).all()

    return [BookingRead.model_validate(booking[0]) for booking in bookings]


def create_booking(model: BookingCreate, session: SessionDep) -> BookingRead:
    """Creates a new booking row in the database."""

    # booking with None id
    booking = Booking.model_validate(model)

    session.add(booking)
    session.commit()  # assigned an id here by the db
    session.refresh(booking)  # fetch the booking with id filled

    return BookingRead.model_validate(booking)


def remove_booking(id: int, session: SessionDep) -> BookingRead | None:
    """Deletes the requested booking from the database.

    Args:
        id: ID of the booking to delete.

    Returns:
        Removed booking on success or `None` if no booking was found with the requested `id`.
    """

    booking = session.get(Booking, id)

    if booking is not None:
        session.delete(booking)
        session.commit()

    return BookingRead.model_validate(booking)


# def update_booking(
#     id: int, model: BookingUpdate, session: SessionDep
# ) -> BookingRead | None:
#     """Updates the booking in database with `id` to the fields of provided `model`.
#
#     Args:
#         id: ID of the booking to update.
#         model: Updated model with changes.
#
#     Returns:
#         Updated version of the booking on success or `None` if no booking was found with the
#         requested `id`.
#     """
#
#     booking = read_booking(id, session)
#
#     if booking is not None:
#         # retrieve only fields that are set in booking_update by the client
#         # then update those in db booking
#         _ = booking.sqlmodel_update(model.model_dump(exclude_unset=True))
#
#         session.add(booking)
#         session.commit()
#         session.refresh(booking)
#
#     return booking


def seed_booking(
    model: BookingSeed,
    session: SessionDep,
    movie_id: int | None = None,
    location_id: int | None = None,
    format_id: int | None = None,
) -> BookingRead | str:
    """
    Creates a booking from a seeding model for booking.
    Optional `movie_id`, `location_id` and `format_id` can also be provided if the caller wants to
    bypass the database check. The provided ids are not validated though.
    Returns a reason `str` if the booking could not be created for some reason.
    """

    if movie_id is None:
        tmdb = search_movie(model.movie)

        if tmdb is None:
            return f"No results found on TMDB for {model.movie}."

        if tmdb.poster_path is None:
            return "Primary TMDB movie does not have a poster."

        movie = create_movie(
            MovieCreate(
                name=tmdb.title,
                external_id=tmdb.id,
                poster_path=tmdb.poster_path,
                release_date=tmdb.release_date,
            ),
            session,
        )
        movie_id = movie.id

    if location_id is None:
        maps = search_place(model.location)

        if maps is None:
            return f"No results found on Google Maps for {model.location}."

        location = create_location(
            LocationCreate(
                name=maps.name,
                address=maps.address,
                external_id=maps.id,
            ),
            session,
        )
        location_id = location.id

    if format_id is None:
        format = create_format(model.format, session)
        format_id = format.id

    booking = BookingCreate(
        external_id=model.external_id,
        date=model.date,
        time=model.time,
        seats=model.seats,
        price=model.price,
        source="manual",
        movie_id=movie_id,
        location_id=location_id,
        format_id=format_id,
    )

    return create_booking(booking, session)
