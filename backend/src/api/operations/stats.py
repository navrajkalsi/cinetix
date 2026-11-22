from datetime import date

from sqlalchemy.sql.expression import select
from sqlalchemy.sql.functions import coalesce, count, sum
from sqlmodel.sql.expression import col, distinct

from api.dependencies import SessionDep
from api.models.bookings import Booking
from api.models.movies import Movie
from api.models.stats import Stats, StatsBase


def generate_stats(year: int | None, session: SessionDep) -> Stats:
    """Returns the user statistics for the provided year or all time."""

    # The following single SQL statement gets us the base stats:
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
    # FROM bookings
    # LEFT JOIN movies ON bookings.movie_id = movies.id;

    base_statement = (
        select(
            count().label("bookings"),
            count(distinct(Booking.movie_id)).label("movies"),
            count(distinct(Booking.location_id)).label("locations"),
            count(distinct(Booking.format_id)).label("formats"),
            coalesce(sum(Movie.runtime), 0).label("minutes"),
            count()
            .filter(col(Movie.runtime).is_(None))
            .label("bookings_without_minutes"),
            coalesce(sum(Booking.price), 0).label("cost"),
            count().filter(col(Booking.price).is_(None)).label("bookings_without_cost"),
        )
        .select_from(Booking)
        .join(Movie, isouter=True)
    )

    if year:
        base_statement = base_statement.where(
            col(Booking.date) >= date(year, 1, 1),
            col(Booking.date) < date(year + 1, 1, 1),
        )

    base = session.execute(base_statement).first()
    base = StatsBase.model_validate(base._mapping) if base else None

    if base is None or base.bookings == 0:
        return Stats.empty(year)

    # The following query gets us the frequencies for top listed items, but to limit we have to run
    # three statement.
    #
    # SELECT 'movie' AS type, movie_id AS id, COUNT(id) AS times
    #   FROM bookings
    #   GROUP BY movie_id
    # UNION ALL
    # SELECT 'location' AS type, location_id AS id, COUNT(id) AS times
    #   FROM bookings
    #   GROUP BY location_id
    # UNION ALL
    # SELECT 'format' AS type, format_id AS id, COUNT(id) AS times
    #   FROM bookings
    #   GROUP BY format_id
    # ORDER BY type DESC,times DESC;

    # since there is atleast one booking, therefore we will have atleast one movie, location and format.

    ID_COL = col(Booking.id)
    movie_statement = (
        select(col(Booking.movie_id), count(ID_COL).label("movie_times"))
        .group_by(col(Booking.movie_id))
        .order_by(count(ID_COL).desc())
        .limit(3)
    )
    location_statement = (
        select(col(Booking.location_id), count(ID_COL).label("location_times"))
        .group_by(col(Booking.location_id))
        .order_by(count(ID_COL).desc())
        .limit(3)
    )
    format_statement = (
        select(col(Booking.format_id), count(ID_COL).label("format_times"))
        .group_by(col(Booking.format_id))
        .order_by(count(ID_COL).desc())
        .limit(3)
    )
    movie_times = session.execute(movie_statement).all()
    location_times = session.execute(location_statement).all()
    format_times = session.execute(format_statement).all()

    full = Stats(
        year=year,
        bookings=base.bookings,
        movies=base.movies,
        locations=base.locations,
        formats=base.formats,
        minutes=base.minutes,
        bookings_without_minutes=base.bookings_without_minutes,
        cost=base.cost,
        bookings_without_cost=base.bookings_without_cost,
        most_watched_movies=[movie.tuple() for movie in movie_times],
        most_visited_locations=[location.tuple() for location in location_times],
        most_experienced_formats=[format.tuple() for format in format_times],
    )

    return full
