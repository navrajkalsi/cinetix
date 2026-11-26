from typing import get_args

from sqlmodel import Session

from api.models.formats import Formats
from api.operations.formats import create_format


def seed_formats(session: Session):
    for format in get_args(Formats):
        create_format(format, session)
