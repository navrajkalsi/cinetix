from datetime import datetime
from decimal import Decimal
from pathlib import Path
from typing import Self, override

from pdf.parser import (
    parse_datetime,
    parse_format,
    parse_movie,
    parse_seat,
    transaction_dict,
)
from pdf.scanner import scan_pdf
from tmdb.client import search_movie


class Transaction:
    """Models a parsed transaction receipt received as a booking confirmation from Cineplex.

    The booking confirmation is received as a PDF which needs to be scanned and then parsed.

    Attributes:
        id: Booking ID.
        location: Location of the theater.
        movie: Name of the movie.
        datetime: Date and time of movie start.
        format: Name of the screening format.
        seats: List of seats, where each seat is row followed by seat number ('H17').
        price: Total price of the transaction.
        poster_url: URL of the poster from TMDB. `None` if no movie match was found or the match did
            not have a `poster_url` specified.
    """

    id: str
    location: str
    movie: str
    datetime: datetime
    format: str
    seats: list[str]
    price: Decimal
    poster_url: str | None

    def __init__(
        self,
        id: str,
        location: str,
        movie: str,
        datetime: datetime,
        format: str,
        seats: list[str],
        price: Decimal,
    ):
        tmdb_result = search_movie(movie)

        self.id = id
        self.location = location
        self.movie = movie if tmdb_result is None else tmdb_result[0]
        self.datetime = datetime
        self.format = format
        self.seats = seats
        self.price = price
        self.poster_url = None if tmdb_result is None else tmdb_result[1]

    @classmethod
    def from_pdf(cls, path: Path) -> Self:
        """Reads the PDF at provided `path`, scans it and then parses the scanned text into a
        `Transaction`.

        Args:
            path: Path of the PDF file.

        Returns:
            Transaction: Parsed receipt as a `Transaction`.
        """

        text = scan_pdf(path)
        lines = text.splitlines()
        fields = transaction_dict(lines)

        booking_id = fields["booking_id"][1]
        location = fields["theater_location"][1]
        movie, format = parse_movie(fields["film/performance"][1])
        datetime = parse_datetime(fields["date/time"][1])

        tickets_field = fields["number_of_tickets"]
        tickets_count = int(tickets_field[1])
        tickets_field_index = tickets_field[0]

        # seat information starts from the second row from 'number_of_tickets'
        seats_start_index = tickets_field_index + 2
        # prioritize format informaton encoded in the show title
        if format is None:
            format = parse_format(lines[seats_start_index])

        seat_lines = lines[seats_start_index : seats_start_index + tickets_count]

        seats = [parse_seat(line) for line in seat_lines]
        seats.sort()  # looks good this way

        price = Decimal(fields["total"][1].removeprefix("$").replace(",", ""))

        return cls(booking_id, location, movie, datetime, format, seats, price)

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
