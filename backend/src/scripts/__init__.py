import json

import requests

from converters import transaction_to_booking_create
from pdf import from_args


def create_booking():
    transaction = from_args()
    booking = transaction_to_booking_create(transaction)

    res = requests.post(
        "http://127.0.0.1:8000/bookings", json=json.loads(booking.model_dump_json())
    )

    if res.status_code != 200:
        res.raise_for_status()
