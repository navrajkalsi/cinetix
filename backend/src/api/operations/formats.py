from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models.formats import Format, FormatCreate, FormatRead


def read_format(id: int, session: SessionDep) -> FormatRead | None:
    """Returns the format with the provided `id`, if found."""

    return FormatRead.model_validate(session.get(Format, id))


def read_formats(session: SessionDep) -> Sequence[FormatRead]:
    """Returns the list of all the formats in the database."""

    return [
        FormatRead.model_validate(format)
        for format in session.exec(select(Format)).all()
    ]


def create_format(model: FormatCreate, session: SessionDep) -> FormatRead:
    """Creates a new format row in the database.

    The returned `FormatRead` has all the attribute values from the provided `model`,
    plus a database assigned `id`.
    """

    # format with None id
    format = Format.model_validate(model)

    session.add(format)
    session.commit()  # assigned an id here by the db
    session.refresh(format)  # fetch the format with id filled

    return FormatRead.model_validate(format)
