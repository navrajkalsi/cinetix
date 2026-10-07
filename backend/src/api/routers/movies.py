from collections.abc import Sequence

from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Movie
from api.operations.movies import read_movie, read_movies

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
    responses={404: {"description": "Movie Not Found"}},
)


@router.get("/{id}")
def get_movie(id: int, session: SessionDep) -> Movie:
    movie = read_movie(id, session)

    if movie is None:
        raise HTTPException(status_code=404)

    return movie


@router.get("/")
def get_movies(
    session: SessionDep,
    names_only: bool = False,
) -> Sequence[Movie | str]:
    """Returns a list of requested data of all movies in the database."""

    return read_movies(names_only, session)
