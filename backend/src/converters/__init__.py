from api.models import BookingCreate
from pdf.transaction import Transaction


def transaction_to_booking_create(t: Transaction) -> BookingCreate:
    return BookingCreate(
        booking_id=t.id,
        datetime=t.datetime,
        seats=" ".join(t.seats),
        price=t.price,
        movie=t.movie,
        location=t.location,
        format=t.format,
    )
