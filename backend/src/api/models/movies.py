from sqlmodel import Field, SQLModel


class MovieBase(SQLModel):
    """Fields shared by every movie model."""

    name: str = Field(
        min_length=1, description="Title as it appears in TMDB for `external_id`."
    )
    external_id: int | None = Field(
        default=None, unique=True, description="TMDB ID of the movie."
    )
    poster_url: str | None = Field(
        default=None, description="TMDB poster URL, can be null if TMDB has none."
    )


class MovieCreate(MovieBase):
    """Request body for creating a movie."""


class Movie(MovieBase, table=True):
    """A row in the `movies` table."""

    __tablename__: str = "movies"

    id: int | None = Field(default=None, primary_key=True)


class MovieRead(MovieBase):
    """Response body for quering a movie from the database."""

    id: int
