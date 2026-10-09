from pydantic import (
    AliasPath,
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


class Place(BaseModel):
    """Models a single `placePrediction` object retrieved in `suggestions` array from Google Maps.

    The API model contains many more fields but those are not of any concern to us.
    See the response object here to take a look at the complete returned type:
    `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete?apix_params=%7B%22fields%22%3A%22*%22%2C%22resource%22%3A%7B%22input%22%3A%22Cineplex%22%7D%7D#about_response`
    """

    id: str = Field(validation_alias="placeId", description="Google Maps Place ID.")
    address: str = Field(
        validation_alias=AliasPath("text", "text"),
        description="Full address of the location.",
    )

    model_config = ConfigDict(extra="ignore")


class Autocomplete(BaseModel):
    """Models a response from Google Maps Places Autocomplete API."""

    places: list[Place] = Field(
        default_factory=list,
        validation_alias="suggestions",
        description="List of `placePrediction`s received from Places Autocomplete API.",
    )

    @field_validator("places", mode="before")
    @classmethod
    def unwrap(cls, v):
        return [s["placePrediction"] for s in v if "placePrediction" in s]
