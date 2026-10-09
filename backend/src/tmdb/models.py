from pydantic import BaseModel, ConfigDict


class Movie(BaseModel):
    """Models a single movie object retrieved when searching for a movie from TMDB.

    The API model contains many more fields but those are not of any concern to us.
    See the `results` object here to take a look at the complete returned type:
    `https://developer.themoviedb.org/reference/search-movie`

    Attributes:
        int: TMDB ID of the movie.
        original_title: Title of the movie in the original language of release.
        title: Official translated title. Same as `original_title` for most releases.
        poster_path: Relative path of the movie poster from TMDB. The path also contains the image
            file extension
    """

    id: int
    original_title: str
    title: str
    poster_path: str | None

    model_config = ConfigDict(extra="ignore")


class SearchMovie(BaseModel):
    """Models a response from TMDB `search/movie` endpoint.

    Attributes:
        page: Retrieved page number containing all movie matching the request.
        results: List of all the matched movie objects in the provided `page` number.
        total_pages: Total number of pages matching the requested movie.
        total_results: Total number of movies across all the pages.
    """

    page: int = 0
    results: list[Movie]
    total_pages: int = 0
    total_results: int = 0
