import time
from typing import get_args

from requests.exceptions import ConnectionError as ConnError
from sqlmodel import Session

from api.database import engine
from api.dependencies import SessionDep
from api.models.bookings import BookingRead
from api.models.formats import Formats
from api.operations.bookings import seed_booking
from api.operations.formats import create_format
from scripts.seed_data import NAV


def seed_formats(session: SessionDep):
    for format in get_args(Formats):
        _ = create_format(format, session)


def seed_bookings():
    """
    Seeds the database with private bookings.
    Must not be called from anywhere in the codebase.
    """

    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"

    if len(NAV) > 100:
        raise ValueError(
            "the seeding list if too large. please reduce list size or seed in increments."
        )

    failed: list[str] = []
    # store ids to bypass checks and external api requests
    seen_movies: dict[str, int] = {}
    seen_locations: dict[str, int] = {}
    seen_formats: dict[Formats, int] = {}

    with Session(engine) as session:
        for booking in NAV:
            print(
                f"Creating {BOLD}{UNDERLINE}{booking.movie}{RESET} | {BOLD}{UNDERLINE}{booking.date.__str__()}{RESET}...",
                end="",
            )

            time.sleep(1.25)  # pause to prevent rate limiting of 50 requests per second
            movie_id = seen_movies.get(booking.movie)
            location_id = seen_locations.get(booking.location)
            format_id = seen_formats.get(booking.format)
            try:
                res = seed_booking(booking, session, movie_id, location_id, format_id)

                if isinstance(res, BookingRead):  # success
                    seen_movies[booking.movie] = res.movie_id
                    seen_locations[booking.location] = res.location_id
                    seen_locations[booking.format] = res.format_id
                    print("\u2713")

                else:  # failure
                    print("\u2717")
                    failed.append(
                        BOLD
                        + booking.movie
                        + " | "
                        + booking.date.__str__()
                        + RESET
                        + ": "
                        + res
                    )

            except:
                print("\u2717")
                failed.append(
                    BOLD
                    + booking.movie
                    + " | "
                    + booking.date.__str__()
                    + RESET
                    + ": Unknown Error."
                )

    if len(failed) > 0:
        print("\n\nFailed to create the following movie bookings:")
        for booking in failed:
            print(booking)
