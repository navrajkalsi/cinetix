from api.dependencies import SessionDep
from api.models import Location


def read_location(id: int, session: SessionDep) -> Location | None:
    """Returns the location with the provided `id`, if found."""

    return session.get(Location, id)
