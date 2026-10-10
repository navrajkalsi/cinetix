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

    If a location already exists with the same `external_id`, no new location is created and the
    already present location is returned.

    The returned `LocationRead` has all the attribute values from the provided `model`,
    plus a database assigned `id`.
    """

    # does a location already exist with same external id
    present = session.exec(
        select(Location).where(Location.external_id == model.external_id)
    ).first()

    if present is not None:  # do not create new
        return LocationRead.model_validate(present)

    # location with None id
    location = Location.model_validate(model)

    session.add(location)
    session.commit()  # assigned an id here by the db
    session.refresh(location)  # fetch the location with id filled

    return LocationRead.model_validate(location)
