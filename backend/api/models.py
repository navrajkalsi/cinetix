from datetime import date, time
from decimal import Decimal

from sqlmodel import Field, SQLModel


class BaseCreate(SQLModel):
    name: str


class Location(BaseCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class Movie(BaseCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class Format(BaseCreate, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class BookingBase(SQLModel):
    booking_id: str | None = (
        None  # id from ticket vendor, some vendors may not provide this
    )
    date: date
    time: time
    seats: str | None = None
    price: Decimal


class BookingCreate(BookingBase):
    movie: str
    location: str
    format: str


# different for getting a request object, instead of query params
class BookingUpdate(SQLModel):
    seats: str | None = None
    price: Decimal | None = None


class Booking(BookingBase, table=True):
    id: int | None = Field(default=None, primary_key=True)  # internal unique id
    movie_id: int = Field(foreign_key="movie.id")
    location_id: int = Field(foreign_key="location.id")
    format_id: int = Field(foreign_key="format.id")
