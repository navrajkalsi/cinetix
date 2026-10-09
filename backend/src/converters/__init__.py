from api.models.bookings import BookingCreate
from api.models.formats import Format, FormatCreate
from api.models.locations import Location, LocationCreate
from api.models.movies import Movie, MovieCreate
from pdf.transaction import Transaction
from tmdb.client import search_movie


def transaction_to_movie_create(t: Transaction) -> MovieCreate:
    tmdb_result = search_movie(t.movie)

    return MovieCreate(
        name=t.movie if tmdb_result is None else tmdb_result.title,
        external_id=None if tmdb_result is None else tmdb_result.id,
        poster_url=None if tmdb_result is None else tmdb_result.poster_path,
    )


def transaction_to_location_create(t: Transaction) -> LocationCreate:
    return LocationCreate(name=t.location, external_id=None)


def transaction_to_format_create(t: Transaction) -> FormatCreate:
    return FormatCreate(name=t.format)


def transaction_to_booking_create(
    t: Transaction, m: Movie, l: Location, f: Format
) -> BookingCreate:

    assert m.id and l.id and f.id

    return BookingCreate(
        external_id=t.id,
        date=t.datetime.date(),
        time=t.datetime.time(),
        seats=t.seats,
        price=t.price,
        movie_id=m.id,
        location_id=l.id,
        format_id=f.id,
    )
