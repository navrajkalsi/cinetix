from collections.abc import Sequence

from sqlmodel import select

from api.dependencies import SessionDep
from api.models import Format


def read_format(id: int, session: SessionDep) -> Format | None:
    """Returns the format with the provided `id`, if found."""

    return session.get(Format, id)


def read_formats(names_only: bool, session: SessionDep) -> Sequence[Format | str]:
    """Returns requested data from all the formats in the database.

    Args:
        names_only: Flag for only requesting the name of every format.

    Returns:
        A list of full data of all formats or just their names.
    """

    statement = select(Format.name) if names_only else select(Format)

    return session.exec(statement).all()
