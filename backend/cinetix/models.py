from datetime import datetime
from decimal import Decimal

from sqlmodel import Field, SQLModel


class BaseCreate(SQLModel):
    name: str


class Location(BaseCreate, table=True):
    __tablename__: str = "locations"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class Movie(BaseCreate, table=True):
    __tablename__: str = "movies"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class Format(BaseCreate, table=True):
    __tablename__: str = "formats"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)


class BookingBase(SQLModel):
    booking_id: str | None = (
        None  # id from ticket vendor, some vendors may not provide this
    )
    datetime: datetime
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
    __tablename__ = "bookings"

    id: int | None = Field(default=None, primary_key=True)  # internal unique id
    movie_id: int = Field(foreign_key="movies.id")
    location_id: int = Field(foreign_key="locations.id")
    format_id: int = Field(foreign_key="formats.id")


class BookingRead(BookingBase):
    id: int
    movie: Movie
    location: Location
    format: Format

    @classmethod
    def from_booking(
        cls, booking: Booking, movie: Movie, location: Location, format: Format
    ) -> BookingRead:
        assert booking.id is not None

        return BookingRead(
            id=booking.id,
            booking_id=booking.booking_id,
            datetime=booking.datetime,
            seats=booking.seats,
            price=booking.price,
            movie=movie,
            location=location,
            format=format,
        )
