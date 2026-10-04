from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Location
from api.operations.locations import read_location

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
