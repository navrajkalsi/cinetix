from tmdb.client import search_movie


# for stopping lint errors
def not_none(check: tuple[str, str | None] | None) -> tuple[str, str | None]:
    assert check is not None
    return check


def test_search_movie():
    assert search_movie("Navraj's Life") is None
    assert not_none(search_movie("The Odyssey"))[0] == "The Odyssey"
    assert not_none(search_movie("the odyssey"))[0] == "The Odyssey"
    assert not_none(search_movie("odyssey"))[0] == "The Odyssey"
    assert not_none(search_movie("Dune"))[0] == "Dune"
    assert not_none(search_movie("Dune: Part 3"))[0] == "Dune: Part Three"
    assert not_none(search_movie("Dune: Part Three"))[0] == "Dune: Part Three"
    assert not_none(search_movie("Avengers Endgame: Encore"))[0] == "Avengers: Endgame"
