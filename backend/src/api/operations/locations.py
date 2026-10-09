from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models.locations import Location, LocationCreate, LocationRead


def read_location(id: int, session: SessionDep) -> LocationRead | None:
    """Returns the location with the provided `id`, if found."""

    return LocationRead.model_validate(session.get(Location, id))


def read_locations(session: SessionDep) -> Sequence[LocationRead]:
    """Returns the list of all the formats in the database."""

    return [
        LocationRead.model_validate(location)
        for location in session.exec(select(Location)).all()
    ]


def create_location(model: LocationCreate, session: SessionDep) -> LocationRead:
    """Creates a new location row in the database.

    The returned `LocationRead` has all the attribute values from the provided `model`,
    plus a database assigned `id`.
    """

    # location with None id
    location = Location.model_validate(model)

    session.add(location)
    session.commit()  # assigned an id here by the db
    session.refresh(location)  # fetch the location with id filled

    return LocationRead.model_validate(location)
