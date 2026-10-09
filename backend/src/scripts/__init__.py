import json

import requests

from api.models.bookings import Booking, BookingCreate
from api.models.formats import Format, FormatCreate
from api.models.locations import Location, LocationCreate
from api.models.movies import Movie, MovieCreate
from converters import (
    transaction_to_booking_create,
    transaction_to_format_create,
    transaction_to_location_create,
    transaction_to_movie_create,
)
from pdf import from_args


def create_booking():
    transaction = from_args()

    movie: MovieCreate | Movie = transaction_to_movie_create(transaction)
    movie = Movie.model_validate(
        requests.post(
            "http://127.0.0.1:8000/movies/", json=json.loads(movie.model_dump_json())
        ).json()
    )

    location: LocationCreate | Location = transaction_to_location_create(transaction)
    location = Location.model_validate(
        requests.post(
            "http://127.0.0.1:8000/locations/",
            json=json.loads(location.model_dump_json()),
        ).json()
    )

    format: FormatCreate | Format = transaction_to_format_create(transaction)
    format = Format.model_validate(
        requests.post(
            "http://127.0.0.1:8000/formats/", json=json.loads(format.model_dump_json())
        ).json()
    )

    booking: BookingCreate | Booking = transaction_to_booking_create(
        transaction, movie, location, format
    )
    res = requests.post(
        "http://127.0.0.1:8000/bookings/", json=json.loads(booking.model_dump_json())
    )

    if res.status_code != 200:
        res.raise_for_status()

    booking = Booking.model_validate(res.json())

    print("Added new booking\n:", booking)
