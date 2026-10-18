from api.models.bookings import BookingCreate
from api.models.formats import Format, FormatCreate
from api.models.locations import Location, LocationCreate
from api.models.movies import Movie, MovieCreate
from maps.client import search_place
from pdf.transaction import Transaction
from tmdb.client import search_movie


def transaction_to_movie_create(t: Transaction) -> MovieCreate:
    tmdb_result = search_movie(t.movie)

    if tmdb_result is None:
        raise ValueError("could not find the tmdb id")

    if tmdb_result.poster_path is None:
        raise ValueError("primary tmdb movie also does not have a poster path")

    return MovieCreate(
        name=tmdb_result.title,
        external_id=tmdb_result.id,
        poster_path=tmdb_result.poster_path,
        release_date=tmdb_result.release_date,
    )


def transaction_to_location_create(t: Transaction) -> LocationCreate:
    maps_result = search_place(t.location)

    if maps_result is None:
        raise ValueError("could not find the maps place id")

    return LocationCreate(
        name=maps_result.name,
        address=maps_result.address,
        external_id=maps_result.id,
    )


def transaction_to_format_create(t: Transaction) -> FormatCreate:
    return FormatCreate(name=t.format)


def transaction_to_booking_create(
    t: Transaction, m: Movie, l: Location, f: Format
) -> BookingCreate:

    assert m.id and l.id and f.id

    return BookingCreate(
        external_id=t.id,
        date_time=t.datetime,
        seats=t.seats,
        price=t.price,
        movie_id=m.id,
        location_id=l.id,
        format_id=f.id,
        source="auto",
    )
