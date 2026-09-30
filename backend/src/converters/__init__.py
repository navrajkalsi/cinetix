from api.models import BookingCreate
from pdf.transaction import Transaction
from tmdb.client import search_movie


def transaction_to_booking_create(t: Transaction) -> BookingCreate:
    tmdb_result = search_movie(t.movie)

    return BookingCreate(
        booking_id=t.id,
        datetime=t.datetime,
        seats=", ".join(t.seats),
        price=t.price,
        movie=t.movie if tmdb_result is None else tmdb_result[0],
        location=t.location,
        format=t.format,
        movie_poster_url=None if tmdb_result is None else tmdb_result[1],
    )
