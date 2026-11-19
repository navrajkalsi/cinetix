from typing import Annotated

from fastapi import APIRouter, Query

from api.dependencies import SessionDep
from api.models.stats import Stats
from api.operations.stats import generate_stats

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


@router.get("/")
def get_stats(
    session: SessionDep,
    year: Annotated[
        int | None,
        Query(
            description="Year the returned statistics should be from. If no provided, statistics from all the years are returned."
        ),
    ] = None,
) -> Stats:
    """Retrieves the user statistics for the provided year or all time."""

    return generate_stats(year, session)
