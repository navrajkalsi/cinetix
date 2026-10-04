from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Format
from api.operations.formats import read_format

router = APIRouter(
    prefix="/formats",
    tags=["formats"],
    responses={404: {"description": "Format Not Found"}},
)


@router.get("/{id}")
def get_format(id: int, session: SessionDep) -> Format:
    format = read_format(id, session)

    if format is None:
        raise HTTPException(status_code=404)

    return format
