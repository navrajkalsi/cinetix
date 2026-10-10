from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models.movies import Movie, MovieCreate, MovieRead


def read_movie(id: int, session: SessionDep) -> MovieRead | None:
    """Returns the movie with the provided `id`, if found."""

    return MovieRead.model_validate(session.get(Movie, id))


def read_movies(session: SessionDep) -> Sequence[MovieRead]:
    """Returns the list of all the movies in the database."""

    return [
        MovieRead.model_validate(movie) for movie in session.exec(select(Movie)).all()
    ]


def create_movie(model: MovieCreate, session: SessionDep) -> MovieRead:
    """Creates a new movie row in the database.

    If a movie already exists with the same `external_id`, no new movie is created and the
    already present movie is returned.

    The returned `MovieRead` has all the attribute values from the provided `model`,
    plus a database assigned `id`.
    """

    # does a movie already exist with same external id
    present = session.exec(
        select(Movie).where(Movie.external_id == model.external_id)
    ).first()

    if present is not None:  # do not create new
        return MovieRead.model_validate(present)

    # movie with None id
    movie = Movie.model_validate(model)

    session.add(movie)
    session.commit()  # assigned an id here by the db
    session.refresh(movie)  # fetch the movie with id filled

    return MovieRead.model_validate(movie)
