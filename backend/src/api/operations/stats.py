from datetime import date

from sqlmodel import select

from api.dependencies import SessionDep
from api.models.bookings import Booking
from api.models.stats import Stats


def stats(year: int | None, session: SessionDep) -> Stats:
    """Returns the user statistics for the provided year or all time."""

    statement = select(Booking)

    if year:
        statement = statement.where(
            Booking.date >= date(year, 1, 1),
            Booking.date < date(year + 1, 1, 1),
        )

    bookings = session.exec(statement).all()

    if len(bookings) == 0:
        return Stats.empty()
