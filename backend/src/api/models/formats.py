from typing import Literal

from sqlalchemy import String
from sqlmodel import Field, SQLModel

# add union from a dict, that contains the format name with icon file
FORMATS = {
    "UltraAVX": "ultraavx.svg",
    "IMAX 70MM": "imax-70mm.svg",
    "IMAX": "imax.svg",
    "4DX": "4dx.svg",
    "VIP": "vip.svg",
    "ScreenX": "screenx.svg",
    "Regular": "regular.svg",
}

FormatName = Literal[
    "UltraAVX", "IMAX 70MM", "IMAX", "4DX", "VIP", "ScreenX", "Regular"
]


class FormatBase(SQLModel):
    """Fields shared by every format model."""

    name: FormatName = Field(
        sa_type=String, unique=True, index=True, description="Name of the format."
    )


class FormatCreate(FormatBase):
    """Request body for creating a new format."""


class FormatDetails(FormatBase):
    """Expanded format model with additional details."""

    backdrop_path: str = Field(
        description="Backdrop image path, served from the frontend root."
    )


class FormatRead(FormatDetails):
    """Response body for quering a format from the database."""

    id: int


class Format(FormatDetails, table=True):
    """A row in the `formats` table."""

    __tablename__: str = "formats"

    id: int | None = Field(default=None, primary_key=True)
