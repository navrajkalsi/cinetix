import re
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
*******************: -$45.18
Balance Due: $0.00
Scene+ card: ********************
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

    if len(row_separated) != 2 or len(seat_separated) != 2:
        raise ValueError(
            "seat line could not be parsed. Number of tickets is probably wrong"
        )

    row = row_separated[1].strip().split()[0]
    num = seat_separated[1].strip().split()[0]

    return row + num


# takes in any seat row, as format remains the same for all the seats
def parse_format(s: str) -> str:
    row_split = s.split("Row", maxsplit=1)[0]
    split = row_split.split("#")[
        0
    ].strip()  # sometimes theater number is appended with #
    # like '4DX #4' or 'Aud #2' or 'IMAX #9'

    if split.startswith(
        ("Cinema ", "Aud ")
    ):  # handle 'Cinema 7' & 'Cinema 4 (2nd level)' & 'Aud 2'
        return "Regular"
    elif split.startswith("VIP "):
        return "VIP"
    else:
        return split


# cineplex api is not publicly accessible,
# therefore this is the solution to normalize movie names
# problem:
# when booking tickets for premium large formats(PLF), the movie title is often altered to reflect the PLF name as well.
# this would create two different 'movie' strings for the same movie seen in a different format.
# example:
# movie: The Odyssey
# when seen in regular cinemas, the ticket correctly shows 'The Odyssey'
# when seen in IMAX, the ticket shows 'The Odyssey - The IMAX Experience®'
# when seen in IMAX 70MM, the ticket shows 'The Odyssey: The IMAX Experience® in 70MM Film'
# this gets especially tricky when you see that the second and third variants use '-' and ':'
# respectively. wtf would anyone do that???
# after wasting much time with dev tools at cineplex's site, I have ended up with this function that
# is essentially a heuristic and represents the best way to handle the most of the ticket naming
# disasters I have encountered
#
# common naming disasters:
# 'Kill Bill: The Whole Bloody Affair - Special Engagement 70mm';
# needs to return 'Kill Bill: The Whole Bloody Affair'
# 'Back To The Future: 40th Anniversary – The IMAX Experience®';
# needs to return 'Back To The Future'
# 'Top Gun - 40th Anniversary';
# needs to return 'Top Gun'
# 'Dune (2021) IMAX REISSUE';
# needs to return 'Dune'
# 'Avatar: Fire and Ash - An IMAX 3D Experience® in HFR';
# needs to return 'Avatar: Fire and Ash'
#
# WHAT IN THE ACTUAL Fk!?
def parse_movie_format(movie: str, format: str) -> tuple[str, str]:
    if "The IMAX Experience®" in movie:  # 2d imax
        split = movie.split("The IMAX Experience®")
        movie = (
            split[0]
            .strip()
            .removesuffix(":")
            .removesuffix("-")
            .removesuffix("—")
            .strip()
        )

        if format != "IMAX":
            raise ValueError(f"IMAX format parsed from seats as: {format}")

        format = "IMAX 70MM" if "70" in split[1] else format

    elif "An IMAX 3D Experience®" in movie:  # 3d imax
        split = movie.split("An IMAX 3D Experience®")
        movie = (
            split[0]
            .strip()
            .removesuffix(":")
            .removesuffix("-")
            .removesuffix("—")
            .strip()
        )

        if format != "IMAX":
            raise ValueError(f"IMAX format parsed from seats as: {format}")

        format = "IMAX 3D HFR" if "HFR" in split[1] else "IMAX 3D"

    elif "Special Engagement" in movie:  # 3d imax
        split = movie.split("Special Engagement")
        movie = (
            split[0]
            .strip()
            .removesuffix(":")
            .removesuffix("-")
            .removesuffix("—")
            .strip()
        )

        if format != "Regular":
            raise ValueError(f"regular format parsed from seats as: {format}")

        format = "70MM" if "70" in split[1] else format

    else:
        # split at parenthesis pair and discard text inside it
        paranthesis = re.search("\\(.*\\)", movie, re.DOTALL)

        if paranthesis:
            movie = movie[: paranthesis.start()].strip()
    # there may still be anniversay info
    anniversary = re.search("\\d+th anniversary", movie, re.IGNORECASE)

    if anniversary:
        movie = movie[: anniversary.start()].strip()

    return movie.strip().removesuffix(":").removesuffix("-").removesuffix(
        "—"
    ).strip(), format


# the returned dict has all its keys and values strip()ed of any whitespace
def transaction_dict(lines: list[str]) -> dict[str, tuple[int, str]]:
    # only the strings with a field contain ':'.
    # A line may contain more than one ':' therefore we only split at the first
    # A line that does not contain ':' does not concern us and is just ignored

    contains_colon = filter(lambda t: ":" in t[1], enumerate(lines))
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
