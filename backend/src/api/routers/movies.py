from fastapi import APIRouter, HTTPException

from api.dependencies import SessionDep
from api.models import Movie
from api.operations.movies import read_movie

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
