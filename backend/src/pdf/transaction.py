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

    row_separated = s.split("Row", 1)
    seat_separated = s.split("Seat", 1)

    assert len(row_separated) == 2
    assert len(seat_separated) == 2

    row = row_separated[1].strip().split()[0]
    num = seat_separated[1].strip().split()[0]

    return row + num


# the returned dict has all its keys and values strip()ed of any whitespace
def transaction_dict(lines: list[str]) -> dict[str, tuple[int, str]]:
    # only the strings with a field contain ':'.
    # A line may contain more than one ':' therefore we only split at the first
    # A line that does not contain ':' does not concern us and is just ignored

    contains_colon = filter(lambda t: t[1].__contains__(":"), enumerate(lines))
    # list of tuples
    # each tuple contains the line index from lines and a list of two strs retrieved after
    # spliting across ':'
    separated = [(x[0], x[1].split(":", maxsplit=1)) for x in contains_colon]

    return {
        split[1][0].strip().lower().replace(" ", "_"): (split[0], split[1][1].strip())
        for split in separated
    }


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

        self.format = "IMAX"
        # seat information starts from the second row from 'number_of_tickets'
        seats_start_index = tickets_field_index + 2
        self.format = lines[seats_start_index].split(maxsplit=1)[
            0
        ]  # format will be same for all the tickets

        # maybe fragile as i have seen seats labelled as AAA,
        # there could be more edge cases like this
        seat_lines = lines[seats_start_index : seats_start_index + tickets_count]

        self.seats = [parse_seat(line) for line in seat_lines]
        self.seats.sort()  # looks good this way

        self.price = Decimal(fields["total"][1][1:])  # skips dollar sign

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
