from collections.abc import Sequence

from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Location
from api.operations.locations import read_location, read_locations

router = APIRouter(
    prefix="/locations",
    tags=["locations"],
    responses={404: {"description": "Location Not Found"}},
)


@router.get("/{id}")
def get_location(id: int, session: SessionDep) -> Location:
    location = read_location(id, session)

    if location is None:
        raise HTTPException(status_code=404)

    return location


@router.get("/")
def get_locations(
    session: SessionDep,
    names_only: bool = False,
) -> Sequence[Location | str]:
    """Returns a list of requested data of all locations in the database."""

    return read_locations(names_only, session)
