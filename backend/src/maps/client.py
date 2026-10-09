from collections.abc import Sequence

import requests

from api.models.locations import LocationCreate
from config import config
from maps.models import Autocomplete, Place

KEY = config.google_maps_api_key

# GET endpoints for different data
URLS = {
    "autocomplete": "https://places.googleapis.com/v1/places:autocomplete",
}

HEADERS = {"Content-Type": "application/json", "X-Goog-Api-Key": KEY}


def search_place(name: str) -> Place | None:
    """Searches Google Maps for any matching place name of type `movie_theater`.

    If multiple matches are found the first one is returned.
    No custom sorting is applied.

    Args:
        name: Name of the place to search for.

    Returns:
        Returns a validated `Place` if a match is found. Otherwise returns `None`.
    """

    # json request obj
    json = {"input": f"{name}", "includedPrimaryTypes": "movie_theater"}

    response = requests.post(url=URLS["autocomplete"], json=json, headers=HEADERS)

    response.raise_for_status()  # raises exception for any status code less than 400

    model = Autocomplete.model_validate(response.json())

    if len(model.places) == 0:
        return None

    return model.places[0]


def search_place_matches(name: str) -> Sequence[LocationCreate]:
    """Searches Google Maps for all places matching the `name`.

    Args:
        name: Closely typed place name.

    Returns:
        Returns the list of all `LocationCreate`s matching the supplied string.
        Returns an empty list if no matches were found.
    """

    # json request obj
    json = {"input": f"{name}", "includedPrimaryTypes": "movie_theater"}

    response = requests.post(url=URLS["autocomplete"], json=json, headers=HEADERS)

    response.raise_for_status()  # raises exception for any status code less than 400

    model = Autocomplete.model_validate(response.json())

    return [
        LocationCreate(name=place.address, external_id=place.id)
        for place in model.places
    ]
