from sqlmodel import Field, SQLModel


class LocationBase(SQLModel):
    """Fields shared by every location model."""

    name: str = Field(
        min_length=1,
        description="Display name as it appears in Google Maps for `external_id`.",
    )
    external_id: str = Field(
        min_length=1, unique=True, description="Google Maps Place ID of the theater."
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
