from decimal import Decimal
from typing import Self

from sqlmodel import Field, SQLModel


class StatsBase(SQLModel):
    """Base user statistics, queried initally from the database."""

    bookings: int = Field(description="Number of bookings/visits.")
    movies: int = Field(description="Number of movies watched.")
    locations: int = Field(description="Number of locations visited.")
    formats: int = Field(description="Number of formats experienced.")
    minutes: int = Field(
        description="Number of minutes spent at the movies, for the accounted for bookings."
    )
    bookings_without_minutes: int = Field(
        description="Number of bookings that were related to movies that did not have a runtime, and were therefore not accounted for in counting total minutes."
    )
    cost: Decimal = Field(
        description="Amount spent at the movies, for the accounted for bookings."
    )
    bookings_without_cost: int = Field(
        description="Number of bookings that did not have any amount spent, and were therefore not accounted for in counting total cost."
    )


class Stats(StatsBase):
    """User statistics for a given year or all time."""

    year: int | None = Field(
        default=None, description="Specific year the stats belong to, if any."
    )
    most_watched_movies: list[tuple[int, int]] = Field(
        default_factory=list,
        description="Most watched movie IDs with number of watches.",
    )
    most_visited_locations: list[tuple[int, int]] = Field(
        default_factory=list,
        description="Most visited location IDs with number of visits.",
    )
    most_experienced_formats: list[tuple[int, int]] = Field(
        default_factory=list,
        description="Most experienced format IDs with number of experiences.",
    )

    @classmethod
    def empty(cls, year: int | None = None) -> Self:
        return cls(
            year=year,
            bookings=0,
            movies=0,
            locations=0,
            formats=0,
            minutes=0,
            bookings_without_minutes=0,
            cost=Decimal(0),
            bookings_without_cost=0,
        )
