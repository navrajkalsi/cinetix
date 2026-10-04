from api.dependencies import SessionDep
from api.models import Format


def read_format(id: int, session: SessionDep) -> Format | None:
    """Returns the format with the provided `id`, if found."""

    return session.get(Format, id)
