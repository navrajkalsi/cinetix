import tomllib
from collections.abc import Sequence
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from config import config

from .database import get_session, init_db, remove_db
from .models import (
    Booking,
    BookingCreate,
    BookingRead,
    BookingUpdate,
    Format,
    Location,
    Movie,
)
from .operations import (
    create,
    delete,
    get,
    get_all,
    get_formats,
    get_locations,
    get_movies,
    get_upcoming_current,
    get_year,
    update,
)

SessionDep = Annotated[Session, Depends(get_session)]

# Defaults
DESCRIPTION = "api to manage movies database operations"
VERSION = "0.1"

with Path("pyproject.toml").open("rb") as f:
    project_config: dict[str, str] = tomllib.load(f).get("project", {})


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield
    # remove_db()


# Launch api with custom args or fallback to defaults
app = FastAPI(
    title="Cinetix API",
    description=project_config.get("description", DESCRIPTION),
    version=project_config.get("version", VERSION),
    lifespan=lifespan,
)

# Allowing foreign origins to access the api
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/bookings/")
def create_booking(data: BookingCreate, session: SessionDep) -> Booking:
    return create(data, session)


# returns upcoming and recent bookings of current year
@app.get("/bookings/")
def read_current_bookings(
    session: SessionDep, _offset: int = 0, _limit: Annotated[int, Query(le=100)] = 100
) -> Sequence[BookingRead]:
    return get_upcoming_current(session)


@app.get("/bookings/{year}")
def read_booking(year: int, session: SessionDep) -> Sequence[BookingRead]:
    return get_year(year, session)


@app.patch("/bookings/{id}")
def update_booking(id: int, data: BookingUpdate, session: SessionDep) -> BookingRead:
    booking = update(id, data, session)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    return booking


@app.delete("/bookings/{id}", status_code=204)
def delete_booking(id: int, session: SessionDep):
    booking = delete(id, session)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")


@app.get("/movies/")
def read_movies(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> Sequence[Movie]:
    return get_movies(session, offset, limit)


@app.get("/locations/")
def read_locations(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> Sequence[Location]:
    return get_locations(session, offset, limit)


@app.get("/formats/")
def read_formats(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> Sequence[Format]:
    return get_formats(session, offset, limit)
