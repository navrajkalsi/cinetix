import tomllib
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import bookings, formats, locations, movies
from config import config

from .database import init_db, remove_db

# Defaults
DESCRIPTION = "api to manage movies database operations"
VERSION = "0.1"

with Path("pyproject.toml").open("rb") as f:
    project_config: dict[str, str] = tomllib.load(f).get("project", {})


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield
    remove_db()


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

app.include_router(bookings.router)
app.include_router(movies.router)
app.include_router(locations.router)
app.include_router(formats.router)
