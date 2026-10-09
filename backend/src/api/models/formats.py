from sqlmodel import Field, SQLModel


class FormatBase(SQLModel):
    """Fields shared by every format model."""

    name: str = Field(min_length=1, unique=True, description="Name of the format.")


class FormatCreate(FormatBase):
    """Request body for creating a new format."""


class Format(FormatBase, table=True):
    """A row in the `formats` table."""

    __tablename__: str = "formats"

    id: int | None = Field(default=None, primary_key=True)


class FormatRead(FormatBase):
    """Response body for quering a format from the database."""

    id: int
