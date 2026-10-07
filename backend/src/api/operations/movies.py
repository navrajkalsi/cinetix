from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models import Movie


def read_movie(id: int, session: SessionDep) -> Movie | None:
    """Returns the movie with the provided `id`, if found."""

    return session.get(Movie, id)


def read_movies(names_only: bool, session: SessionDep) -> Sequence[Movie | str]:
    """Returns requested data from all the movies in the database.

    Args:
        names_only: Flag for only requesting the name of every movie.

    Returns:
        A list of full data of all movies or just their names.
    """

    statement = select(Movie.name) if names_only else select(Movie)

    return session.exec(statement).all()
