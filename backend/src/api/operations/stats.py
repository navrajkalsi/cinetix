from datetime import date

from sqlalchemy import select
from sqlalchemy.sql.functions import count, mode, sum
from sqlmodel import literal_column
from sqlmodel.sql.expression import distinct

from api.dependencies import SessionDep
from api.models.bookings import Booking
from api.models.movies import Movie
from api.models.stats import Stats


def generate_stats(year: int | None, session: SessionDep) -> Stats:
    """Returns the user statistics for the provided year or all time."""

    # The following single SQL statement gets us the full stats:
    #
    # SELECT
    #   COUNT(bookings.id) AS bookings,
    #   COUNT(DISTINCT movie_id) AS movies,
    #   COUNT(DISTINCT location_id) AS locations,
    #   COUNT(DISTINCT format_id) AS formats,
    #   SUM(movies.runtime) AS minutes,
    #   COUNT(*) FILTER (WHERE movies.runtime IS NULL) AS without_minutes,
    #   SUM(bookings.price) AS cost,
    #   COUNT(*) FILTER (WHERE bookings.price IS NULL) AS without_cost,
    #   MODE() WITHIN GROUP (ORDER BY bookings.movie_id) AS movie,
    #   MODE() WITHIN GROUP (ORDER BY bookings.location_id) AS location,
    #   MODE() WITHIN GROUP (ORDER BY bookings.format_id) AS format
    # FROM bookings
    # LEFT JOIN movies ON bookings.movie_id = movies.id;

    statement = (
        select(
            literal_column(str(year) if year is not None else "NULL").label("year"),
            count(Booking.id).label("bookings"),
            count(distinct(Booking.movie_id)).label("movies"),
            count(distinct(Booking.location_id)).label("locations"),
            count(distinct(Booking.format_id)).label("formats"),
            sum(Movie.runtime).label("minutes"),
            count().filter(Movie.runtime.is_(None)).label("bookings_without_minutes"),
            sum(Booking.price).label("cost"),
            count().filter(Booking.price.is_(None)).label("bookings_without_cost"),
            mode().within_group(Booking.movie_id).label("movie_id"),
            mode().within_group(Booking.location_id).label("location_id"),
            mode().within_group(Booking.format_id).label("format_id"),
        )
        .select_from(Booking)
        .outerjoin(Movie, Booking.movie_id == Movie.id)
    )

    if year:
        statement = statement.where(
            Booking.date >= date(year, 1, 1),
            Booking.date < date(year + 1, 1, 1),
        )

    result: Stats | None = session.exec(statement).first()

    if result is None or result.bookings == 0:
        return Stats.empty(year)

    return result
