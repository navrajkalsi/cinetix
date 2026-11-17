from typing import Self

from sqlmodel import Field, SQLModel


class Stats(SQLModel):
    """User statistics for a given year or all time."""

    year: int | None = Field(
        default=None, description="Specific year the stats belong to, if any."
    )
    bookings: int = Field(description="Number of bookings/visits.")
    movies: int = Field(description="Number of movies watched.")
    locations: int = Field(description="Number of locations visited.")
    formats: int = Field(description="Number of formats experienced.")
    minutes: int = Field(
        description="Number of minutes spent at the movies, for the accounted for bookings."
    )
    bookings_without_runtime: int = Field(
        description="Number of bookings that were related to movies that did not have a runtime, and were therefore not accounted for in counting total minutes."
    )
    cost: int = Field(
        description="Amount spent at the movies, for the accounted for bookings."
    )
    bookings_without_cost: int = Field(
        description="Number of bookings that did not have any amount spent, and were therefore not accounted for in counting total cost."
    )
    movie_id: int | None = Field(
        default=None, description="Movie watched the most number of times."
    )
    location_id: int | None = Field(
        default=None, description="Location visited the most number of times."
    )
    format_id: int | None = Field(
        default=None, description="Format experienced the most number of times."
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
            bookings_without_runtime=0,
            cost=0,
            bookings_without_cost=0,
        )
