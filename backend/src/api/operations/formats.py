from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models.formats import Format, FormatRead, Formats


def read_format(id: int, session: SessionDep) -> FormatRead | None:
    """Returns the format with the provided `id`, if found."""

    return FormatRead.model_validate(session.get(Format, id))


def read_formats(session: SessionDep) -> Sequence[FormatRead]:
    """Returns the list of all the formats in the database."""

    return [
        FormatRead.model_validate(format)
        for format in session.execute(select(Format)).all()
    ]


def create_format(name: Formats, session: SessionDep) -> FormatRead:
    """Creates a new format row in the database.

    If a format already exists with the same `name`, no new format is created and the
    already present format is returned.
    """

    # does a location already exist with same external id
    present = session.execute(select(Format).where(Format.name == name)).first()

    if present is not None:  # do not create new
        return FormatRead.model_validate(present)

    # format with None id
    format = Format(name=name)
    session.add(format)
    session.commit()  # assigned an id here by the db
    session.refresh(format)  # fetch the format with id filled

    return FormatRead.model_validate(format)
