from typing import Literal

from sqlalchemy import String
from sqlmodel import Field, SQLModel

# format backdrop as svgs can be accessed in frontend using the lowercase format names and the filename.
Formats = Literal[
    "VIP",
    "Regular",
    "3D",
    "UltraAVX",
    "UltraAVX 3D",
    "UltraAVX D-Box",
    "IMAX",
    "IMAX 3D",
    "IMAX 3D HFR",
    "IMAX HFR",
    "IMAX 70MM 3D",
    "IMAX 70MM",
    "4DX",
    "D-Box",
    "ScreenX",
    "70MM",
    "HFR",
]


class FormatBase(SQLModel):
    """Fields shared by every format model."""

    name: Formats = Field(
        sa_type=String, unique=True, index=True, description="Name of the format."
    )


# Formats cannot be created through public API


class FormatRead(FormatBase):
    """Response body for quering a format from the database."""

    id: int


class Format(FormatBase, table=True):
    """A row in the `formats` table."""

    __tablename__: str = "formats"

    id: int | None = Field(default=None, primary_key=True)
