from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models import Location


def read_location(id: int, session: SessionDep) -> Location | None:
    """Returns the location with the provided `id`, if found."""

    return session.get(Location, id)


def read_locations(names_only: bool, session: SessionDep) -> Sequence[Location | str]:
    """Returns requested data from all the locations in the database.

    Args:
        names_only: Flag for only requesting the name of every location.

    Returns:
        A list of full data of all locations or just their names.
    """

    statement = select(Location.name) if names_only else select(Location)

    return session.exec(statement).all()
