from datetime import datetime
from decimal import Decimal
from typing import override

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
Amex FrEEReee 487 9: -$45.18
Balance Due: $0.00
Scene+ card: 604646 *** *** 0 805
Collected points: 240
GST/HST # 83454 5543 RT0001
"""


def parse_datetime(s: str) -> datetime:
    """
    Parses date and time in the following format:
    Friday, September 11, 2026 - 7:00 PM
    """

    # parses in locale tz
    return datetime.strptime(s, "%A, %B %d, %Y - %I:%M %p").astimezone()

    # Parsing identifiers and their meanings: https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior


def parse_seat(s: str) -> str:
    """
    Parses seat row and number in the following format:
    IMAX Row H - Seat 17 CineClub Member-Priced $19.99
    """

    separated = s.split("-", 1)

    assert len(separated) == 2

    row = separated[0].strip().split()[-1]
    num = separated[1].strip().split()[1]  # skip the string literal 'Seat'

    return row + num


class Transaction:
    id: str
    location: str
    movie: str
    datetime: datetime
    format: str
    seats: list[str]
    price: Decimal

    def __init__(self, transaction_string: str):
        fields = transaction_string.splitlines()

        self.id = fields[2].split(":", 1)[1].strip()
        self.location = fields[3].split(":", 1)[1].strip()
        self.movie = fields[4].split(":", 1)[1].strip()

        raw_datetime = fields[5].split(":", 1)[1].strip()
        self.datetime = parse_datetime(raw_datetime)

        tickets_count = int(fields[7].split(":", 1)[1].strip())
        self.format = fields[9].split(maxsplit=1)[
            0
        ]  # format will be same for all the tickets

        # maybe fragile as i have seen seats labelled as AAA,
        # there could be more edge cases like this
        seat_fields = fields[9 : 9 + tickets_count]

        self.seats = [parse_seat(field) for field in seat_fields]
        self.seats.sort()  # looks good this way

        total_index = 9 + tickets_count + 2

        if not fields[total_index].startswith("Total"):
            total_index += 1  # bump up index if 'CineClub Discount' exists

        self.price = Decimal(fields[total_index].split(":", 1)[1].strip()[1:])

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
Price: {self.price}
        """
