from sqlmodel import Field, SQLModel


class LocationBase(SQLModel):
    """Fields shared by every location model."""

    name: str = Field(
        min_length=1,
        description="Name of the location retrieved as `structuredFormat.mainText` from Google Maps Autocomplete.",
    )
    address: str = Field(
        min_length=1,
        description="Address of the location retrieved as `structuredFormat.secondaryText` from Google Maps Autocomplete. Append to `name` to get the full address.",
    )
    external_id: str = Field(
        min_length=1,
        unique=True,
        index=True,
        description="Google Maps Place ID of the theater.",
    )


class LocationCreate(LocationBase):
    """Request body for creating a new location."""


class Location(LocationBase, table=True):
    """A row in the `locations` table."""

    __tablename__: str = "locations"

    id: int | None = Field(default=None, primary_key=True)


class LocationRead(LocationBase):
    """Response body for quering a location from the database."""

    id: int
