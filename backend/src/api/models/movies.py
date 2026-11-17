from sqlmodel import Field, SQLModel
from datetime import date


class MovieBase(SQLModel):
    """Fields shared by every movie model."""

    name: str = Field(
        min_length=1, description="Title as it appears in TMDB for `external_id`."
    )
    external_id: int = Field(
        unique=True, index=True, description="TMDB ID of the movie."
    )
    poster_path: str | None = Field(
        description="TMDB poster path, can be null if TMDB has none."
    )
    release_date: date | None = Field(
        description="TMDB movie release date, can be null if TMDB has none."
    )


class MovieCreate(MovieBase):
    """Request body for creating a movie. Also used as response body for autocomplete results for a movie."""


class MovieDetails(MovieBase):
    """Expanded movie model with additional details."""

    backdrop_path: str | None = Field(
        description="TMDB backdrop path, can be null if TMDB has none.",
    )
    homepage: str | None = Field(description="Link to movie's website.")
    runtime: int | None = Field(description="Runtime of the movie.")
    tagline: str | None = Field(description="Official tagline for the movie.")


class MovieRead(MovieDetails):
    """Response body for quering a movie from the database."""

    id: int


class Movie(MovieDetails, table=True):
    """A row in the `movies` table."""

    __tablename__: str = "movies"

    id: int | None = Field(default=None, primary_key=True)
