from datetime import datetime
from decimal import Decimal
from typing import override

from pdf.parser import parse_datetime, parse_format, parse_seat, transaction_dict

# here is a sample transaction_string
"""
Date of Purchase: Thursday, September 10, 2026 - 8:24 PM
Transaction receipt: 16653761
Booking ID: WS22XD4
Theater Location: Cineplex Cinemas Mississauga Square One
Film/Performance: The Odyssey: The IMAX Experience® in 70MM Film
Date/Time: Friday, September 11, 2026 - 7:00 PM
Rating: PG
Number of tickets: 2
AUDITORIUM SEATS TICKETS PRICE
IMAX Row H - Seat 17 CineClub Member-Priced $19.99
IMAX Row H - Seat 16 CineClub Member-Priced $19.99
Online booking fee (non-refundable): $0.00
CineClub Discount: -$0.00
GST/HST: $5.20
Total: $45.18
*******************: -$45.18
Balance Due: $0.00
Scene+ card: ********************
Collected points: 240
GST/HST # 83454 5543 RT0001
"""


class Transaction:
    id: str
    location: str
    movie: str
    datetime: datetime
    format: str
    seats: list[str]
    price: Decimal

    def __init__(self, transaction_string: str):
        lines = transaction_string.splitlines()
        fields = transaction_dict(lines)

        self.id = fields["booking_id"][1]
        self.location = fields["theater_location"][1]
        self.movie = fields["film/performance"][1]

        raw_datetime = fields["date/time"][1]
        self.datetime = parse_datetime(raw_datetime)

        tickets_field = fields["number_of_tickets"]
        tickets_count = int(tickets_field[1])
        tickets_field_index = tickets_field[0]

        # seat information starts from the second row from 'number_of_tickets'
        seats_start_index = tickets_field_index + 2
        self.format = parse_format(lines[seats_start_index])

        # maybe fragile as i have seen seats labelled as AAA,
        # there could be more edge cases like this
        seat_lines = lines[seats_start_index : seats_start_index + tickets_count]

        self.seats = [parse_seat(line) for line in seat_lines]
        self.seats.sort()  # looks good this way

        self.price = Decimal(fields["total"][1].removeprefix("$").replace(",", ""))

    @override
    def __str__(self) -> str:
        return f"""
ID: {self.id}
Location: {self.location}
Movie: {self.movie}
Date: {self.datetime.date()}
Time: {self.datetime.time()}
Format: {self.format}
Seats: {self.seats}
Price: ${self.price}
        """
