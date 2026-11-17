from datetime import date
from typing import Any, ClassVar

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TMDBMovieBase(BaseModel):
    """Common fields between models received from `search/movie` and `movie/{movie_id}`."""

    id: int = Field(description="TMDB ID of the movie.")
    original_title: str = Field(
        description="Title of the movie in the original language of release."
    )
    title: str = Field(
        description="Official translated title. Same as `original_title` for most releases."
    )
    poster_path: str | None = Field(
        default=None,
        description="Relative path of the movie poster from TMDB. The path also contains the image file extension.",
    )
    # this can be an empty string, which is validated before pydantic tries to parse it to date
    release_date: date | None = Field(
        default=None,
        description="TMDB release date of the movie.",
    )


class DetailsMovie(TMDBMovieBase):
    """Models a response from TMDB `movie/{movie_id}` endpoint."""

    backdrop_path: str | None = Field(
        default=None,
        description="Relative path of the movie backdrop from TMDB. The path also contains the image file extension.",
    )
    homepage: str | None = Field(default=None, description="Link to movie's website.")
    runtime: int | None = Field(default=None, description="Runtime of the movie.")
    tagline: str | None = Field(
        default=None, description="Official tagline for the movie."
    )

    model_config: ClassVar[ConfigDict] = ConfigDict(extra="ignore")

    # validates all the fields
    @field_validator("*", mode="before")
    @classmethod
    def check_none(cls, v: Any):
        return None if v in (0, "") else v


class SearchMovie(TMDBMovieBase):
    """Models a single movie object retrieved when searching for a movie from TMDB.

    This model has more fields than id because when matches are requested, we do not need the full
    `MovieDetails` model and this model will suffice.

    The API model contains many more fields but those are not of any concern to us.
    See the `results` object here to take a look at the complete returned type:
    `https://developer.themoviedb.org/reference/search-movie`
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(extra="ignore")

    @field_validator("poster_path", "release_date", mode="before")
    @classmethod
    def check_empty(cls, v: Any):
        return None if v == "" or v is None else v


class SearchMovies(BaseModel):
    """Models a response from TMDB `search/movie` endpoint."""

    page: int = Field(
        description="Retrieved page number containing all movie matching the request."
    )
    results: list[SearchMovie] = Field(
        default_factory=list,
        description="List of all the matched movie objects in the provided `page` number.",
    )
    total_pages: int = Field(
        description="Total number of pages matching the requested movie."
    )
    total_results: int = Field(
        description="Total number of movies across all the pages."
    )
