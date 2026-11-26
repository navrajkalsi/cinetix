from collections.abc import Sequence

from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models.formats import FormatRead
from api.operations.formats import read_format, read_formats

router = APIRouter(
    prefix="/formats",
    tags=["formats"],
    responses={404: {"description": "Format Not Found"}},
)


@router.get("/{id}")
def get_format(id: int, session: SessionDep) -> FormatRead:
    """Retrieves the format with provided ID."""

    format = read_format(id, session)

    if format is None:
        raise HTTPException(status_code=404)

    return format


@router.get("/")
def get_formats(session: SessionDep) -> Sequence[FormatRead]:
    """Returns the list of all formats in the database."""

    return read_formats(session)


# Formats cannot be created through public api
