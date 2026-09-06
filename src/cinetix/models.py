from datetime import date, time
from decimal import Decimal

from sqlmodel import Field, SQLModel


class LocationCreate(SQLModel):
    name: str = Field(unique=True)


class Location(LocationCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MovieCreate(SQLModel):
    name: str = Field(unique=True)


class Movie(MovieCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)


class FormatCreate(SQLModel):
    name: str = Field(unique=True)


class Format(FormatCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)


class BookingCreate(SQLModel):
    booking_id: str | None = (
        None  # id from ticket vendor, some vendors may not provide this
    )
    date: date
    time: time
    seats: str | None = None
    price: Decimal
    movie: str | int
    location: str | int
    format: str | int


class Booking(BookingCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)  # internal unique id
    movie: int = Field(foreign_key="movie.id")
    location: int = Field(foreign_key="location.id")
    format: int = Field(foreign_key="format.id")
