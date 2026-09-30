import requests

from config import config
from tmdb.models import SearchMovie
from utils import print_debug

KEY = config.tmdb_api_key

# GET endpoints for different data
URLS = {
    # movie url is set to always just the first page
    "movie": "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&query=",
    # image url is set to always fetch the poster image of width 780 pixels
    "image": "https://image.tmdb.org/t/p/w780",
}
# only headers required for accessing all movie search endpoint
HEADERS = {"accept": "application/json", "Authorization": f"Bearer {KEY}"}


def search_movie(name: str) -> tuple[str, str | None] | None:
    """Searches TMDB for any matching movie names.

    If multiple matches are found the first one is returned.
    No custom sorting is applied. TMDB data is used as-is.

    The main purpose of having this validation is to get correctly formatted movie names,
    and their posters as a bonus!
    For Example:
        ["odyssey", "the odyssey", "The Odyssey"] all resolve to "The Odyssey"
        ["dune: part 3", "Dune: Part Three"] all resolve to "Dune: Part Three"
        ["Avengers endgame", "avengers endgame: encore"] all resolve to "Avengers: Endgame"

        Every slightly varied name resolve to a single official release title.

    Args:
        name: Name of the movie to search for.

    Returns:
        Returns a tuple of validated movie-name and a URL for the movie's poster if a match is
        found. Otherwise returns `None`.

        Also returns `None` if TMDB is not setup at startup.

    Raises:
        HTTPError: An error occurred when requesting data from TMDB.
    """

    if KEY is None:
        print_debug("tmdb_api_key not provided, skipping cross-validation of the movie")
        return None

    response = requests.get(url=f"{URLS['movie']}{name}", headers=HEADERS)

    response.raise_for_status()  # raises exception for any status code less than 400

    if response.status_code != 200:
        raise requests.HTTPError(
            f"failed to get a 200 OK response from TMDB, got: {response.status_code}"
        )

    model = SearchMovie.model_validate(response.json())

    if model.total_results == 0:
        print_debug(
            f"tried cross-validation movie: {name}, did not find any matching result"
        )
        return None

    movie = model.results[0]
    poster_url = (
        None if movie.poster_path is None else f"{URLS['image']}{movie.poster_path}"
    )

    if config.save_movie_posters and poster_url is not None:
        poster_ext = poster_url.split(".")[-1]  # poster_paths end with file extensions

        img_res = requests.get(poster_url)
        img_res.raise_for_status()

        with open(movie.title + "." + poster_ext, "wb") as img:
            _ = img.write(img_res.content)

    return movie.title, poster_url
