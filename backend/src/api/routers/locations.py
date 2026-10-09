from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from api.dependencies import SessionDep
from api.models.locations import LocationCreate, LocationRead
from api.operations.locations import create_location, read_location, read_locations
from maps.client import search_place_matches

router = APIRouter(
    prefix="/locations",
    tags=["locations"],
    responses={404: {"description": "Location Not Found"}},
)


@router.get("/search")
def get_location_matches(
    search_term: Annotated[
        str, Query(min_length=1, description="Closely typed location name to search.")
    ],
) -> Sequence[LocationCreate]:
    """Searches Google Maps for any location names matching the `search_term`.

    Returns a list of matches that can be posted back to add to those to the Cinetix database.
    """

    return search_place_matches(search_term)


@router.get("/{id}")
def get_location(id: int, session: SessionDep) -> LocationRead:
    """Retrieves the location with provided ID."""

    location = read_location(id, session)

    if location is None:
        raise HTTPException(status_code=404)

    return location


@router.get("/")
def get_locations(session: SessionDep) -> Sequence[LocationRead]:
    """Returns the list of all locations in the database."""

    return read_locations(session)


@router.post("/")
def post_location(model: LocationCreate, session: SessionDep) -> LocationRead:
    """Adds a new location row in the database."""

    return create_location(model, session)
