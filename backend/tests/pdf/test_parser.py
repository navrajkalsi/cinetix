from datetime import datetime

from pdf.parser import (
    parse_datetime,
    parse_format,
    parse_movie,
    parse_seat,
    transaction_dict,
)

TRANSACTION_RECEIPT: str = """Date of Purchase: Thursday, September 10, 2026 - 8:24 PM
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


def test_transaction_dict():
    oracle = {
        "date_of_purchase": (0, "Thursday, September 10, 2026 - 8:24 PM"),
        "transaction_receipt": (1, "16653761"),
        "booking_id": (2, "WS22XD4"),
        "theater_location": (3, "Cineplex Cinemas Mississauga Square One"),
        "film/performance": (4, "The Odyssey: The IMAX Experience® in 70MM Film"),
        "date/time": (5, "Friday, September 11, 2026 - 7:00 PM"),
        "rating": (6, "PG"),
        "number_of_tickets": (7, "2"),
        "online_booking_fee_(non-refundable)": (11, "$0.00"),
        "cineclub_discount": (12, "-$0.00"),
        "gst/hst": (13, "$5.20"),
        "total": (14, "$45.18"),
        "*******************": (15, "-$45.18"),
        "balance_due": (16, "$0.00"),
        "scene+_card": (17, "********************"),
        "collected_points": (18, "240"),
    }

    assert transaction_dict(TRANSACTION_RECEIPT.splitlines()) == oracle


MOVIE_TEST_CASES = {
    "The Odyssey": ("The Odyssey", None),
    "The Odyssey - The IMAX Experience®": ("The Odyssey", "IMAX"),
    "The Odyssey: The IMAX Experience® in 70MM Film": ("The Odyssey", "IMAX 70MM"),
    "Kill Bill: The Whole Bloody Affair - Special Engagement 70mm": (
        "Kill Bill: The Whole Bloody Affair",
        "70MM",
    ),
    "Back To The Future: 40th Anniversary - The IMAX Experience®": (
        "Back To The Future",
        "IMAX",
    ),
    "Top Gun - 40th Anniversary": ("Top Gun", None),
    "Dune (2021) IMAX REISSUE": ("Dune", "IMAX"),
    "Avatar: Fire and Ash - An IMAX 3D Experience® in HFR": (
        "Avatar: Fire and Ash",
        "IMAX 3D HFR",
    ),
    "The Fantastic 4: First Steps - An IMAX 3D Experience®": (
        "The Fantastic 4: First Steps",
        "IMAX 3D",
    ),
    "Demo: 1st Anniversary": ("Demo", None),
    "Demo: 2nd Anniversary": ("Demo", None),
    "Demo: 3rd Anniversary": ("Demo", None),
    "Demo: 4th Anniversary": ("Demo", None),
    "Demo: Anniversary": ("Demo", None),
    "Demo Anniversary": ("Demo", None),
    "Demo: Anniversary Release": ("Demo", None),
}


def test_parse_movie():
    for input, expected in MOVIE_TEST_CASES.items():
        movie, format = parse_movie(input)
        assert movie == expected[0]
        assert format == expected[1]


def test_parse_datetime():
    assert (
        parse_datetime("Friday, September 25, 2026 - 7:00 PM")
        == datetime(2026, 9, 25, 19).astimezone()
    )


FORMAT_TEST_CASES = {
    "IMAX Row H - Seat 17 CineClub Member-Priced $19.99": "IMAX",
    "Cinema 7 (2nd level) Row F - Seat 1 CineClub Member $0.00": "Regular",
    "AVX #9 (2nd level) Row B - Seat 10 CineClub Member-Priced $14.99": "AVX",
}


def test_parse_format():
    for input, expected in FORMAT_TEST_CASES.items():
        assert parse_format(input) == expected


def test_parse_seat():
    assert parse_seat("IMAX Row H - Seat 17 CineClub Member-Priced $19.99") == "H17"
