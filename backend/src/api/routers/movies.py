from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from api.dependencies import SessionDep
from api.models.movies import MovieCreate, MovieRead
from api.operations.movies import create_movie, read_movie, read_movies
from tmdb.client import search_movie_matches

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
    responses={404: {"description": "Movie Not Found"}},
)


@router.get("/search")
def get_movie_matches(
    search_term: Annotated[
        str, Query(min_length=1, description="Starting of the movie name to search.")
    ],
) -> Sequence[MovieCreate]:
    """Searches the TMDB database for any movie names matching the `search_term`.

    Returns a list of matches that can be posted back to add to those to the Cinetix database.
    """

    return search_movie_matches(search_term)


@router.get("/{id}")
def get_movie(id: int, session: SessionDep) -> MovieRead:
    """Retrieves the movie with provided ID."""

    movie = read_movie(id, session)

    if movie is None:
        raise HTTPException(status_code=404)

    return movie


@router.get("/")
def get_movies(session: SessionDep) -> Sequence[MovieRead]:
    """Returns the list of all movies in the database."""

    return read_movies(session)


@router.post("/")
def post_movie(model: MovieCreate, session: SessionDep) -> MovieRead:
    """Adds a new movie record in the database."""

    return create_movie(model, session)
