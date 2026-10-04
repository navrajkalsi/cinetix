from api.dependencies import SessionDep
from api.models import Movie


def read_movie(id: int, session: SessionDep) -> Movie | None:
    """Returns the movie with the provided `id`, if found."""

    return session.get(Movie, id)
