import re
from datetime import datetime

# Although the format separators are just ':' (colon) and '-' (hyphen),
# these may be recognized as other unicode chars as follows:
COLON_LOOKALIKES = [
    "\u003a",  # colon
    "\uff1a",  # fullwidth colon
    "\u2236",  # ratio
    "\u02f8",  # modified letter raised colon
    "\u0589",  # armenian full stop
    "\u16ec",  # runic multiple punctuation
]
HYPHEN_LOOKALIKES = [
    "\u002d",  # hyphen-minus
    "\u2010",  # hyphen
    "\u2011",  # non-breaking hyphen
    "\u2013",  # en dash
    "\u2014",  # em dash
    "\u2015",  # horizontal bar
    "\u2212",  # minus
]
# complete list of format separators
FORMAT_SEPARATORS = COLON_LOOKALIKES + HYPHEN_LOOKALIKES

COLON_TRANSLATION = str.maketrans({c: ":" for c in COLON_LOOKALIKES})


def transaction_dict(receipt: list[str]) -> dict[str, tuple[int, str]]:
    """Extracts key-value pairs from a transaction receipt.

    Scans each line for a colon or a colon lookalike (see COLON_LOOKALIKES)
    and splits on the first occurrence found. Everything before the split is set as the key.
    The corresponding value is a tuple of index of the line and everything after the split.
    Lines with no colon or lookalike are ignored.

    Keys are lowercased, stripped and all the spaces are replaced with underscores.
    Values are only stripped.

    Args:
        receipt: The full receipt split at newlines as a list.

    Returns:
        A dictionary mapping each field's key to a tuple of line index in receipt, field value.
    """

    # convert all colon_lookalikes to ':'
    normalized = [line.translate(COLON_TRANSLATION) for line in receipt]
    # filter out the lines that contain a ':' with their contents and index
    contains_colon = filter(lambda t: ":" in t[1], enumerate(normalized))
    # a list of index and split results for each line
    separated = [(x[0], x[1].split(":", maxsplit=1)) for x in contains_colon]

    return {
        k.strip().lower().replace(" ", "_"): (i, v.strip()) for i, (k, v) in separated
    }


def remove_suffixes(text: str, suffixes: list[str]) -> str:
    """Removes the first matched suffix in `suffixes` from `text` exactly once,
    after stripping the input `text` of any whitespace.
    Also strips the returned value of any whitespace.

    If suffix is not found, a stripped version of the input `text` would be returned.
    """

    text = text.strip()

    for suffix in suffixes:
        removed = text.removesuffix(suffix)
        if removed != text:
            return removed.strip()

    return text  # already stripped at the first line


def parse_movie(movie: str) -> tuple[str, str | None]:
    """Parses movie name from value of 'Film/Performance' key in a transaction receipt.
    Removes any common format identifiers, and release-year and anniversary information.

    Returns a tuple of normalized 'movie name' and an 'optional format' parsed from the supplied
    movie listing.

    Problem in detail:
        When booking tickets for premium large formats(PLFs),
        the movie title is often altered to reflect the PLF name as well.
        This would create two different 'movie' strings for the same movie seen in a different format.

        Example movie: 'The Odyssey'
            When seen in regular cinemas, the ticket correctly shows 'The Odyssey'.
            In IMAX, the ticket shows 'The Odyssey - The IMAX Experience®'
            In special IMAX 70MM, the ticket shows 'The Odyssey: The IMAX Experience® in 70MM Film'
            In regular 70MM, the ticket shows 'The Odyssey - Special Engagement 70MM'

        This gets tricky when you see that the second and third variants use '-' and ':'
        respectively, as their format separators.
        WTF would anyone do that???

        Dev tools at Cineplex's site have been of no help as to making sense of these naming
        conventions.
        Therefore, this function is the best attempt at manually parsing the most common format identifiers.
        The function is essentially a heuristic and represents the best way to handle most of the ticket naming
        disasters I have encountered.

        Common naming disasters:
            'Kill Bill: The Whole Bloody Affair - Special Engagement 70mm';
                needs to return 'Kill Bill: The Whole Bloody Affair'
            'Back To The Future: 40th Anniversary – The IMAX Experience®';
                needs to return 'Back To The Future'
            'Top Gun - 40th Anniversary';
                needs to return 'Top Gun'
            'Dune (2021) IMAX REISSUE';
                needs to return 'Dune'
            'Avatar: Fire and Ash - An IMAX 3D Experience® in HFR';
                needs to return 'Avatar: Fire and Ash'

        WHAT IN THE ACTUAL Fk!?
    """

    format: str | None = None

    if "IMAX" in movie:
        format = "IMAX"

        if "The IMAX Experience®" in movie:
            # This is the most common IMAX movie naming convention for 2D screenings.
            # The checked string is appended to the movie name with a ':' or '-' separator.
            #
            # Example:
            # 'The Odyssey - The IMAX Experience®'
            #
            # Furthermore, very few screenings of 2D IMAX are presented on 70MM Film.
            # The tickets for these screenings are append with 'in 70MM Film' on top of the IMAX identifier.
            #
            # Example:
            # 'Dune: Part 3: The IMAX Experience® in 70MM Film'
            separated = movie.split("The IMAX Experience®")
            movie = remove_suffixes(separated[0], FORMAT_SEPARATORS)
            # append 70MM if this is a 70MM screening
            format += " 70MM" if "70" in separated[1] else ""

        elif "An IMAX 3D Experience®" in movie:
            # This is the most common IMAX movie naming convention for 3D screenings.
            # The checked string is appended to the movie name with a ':' or '-' separator.
            #
            # Example:
            #     'The Fantastic 4: First Steps - An IMAX 3D Experience®'
            #
            # Furthermore, few screenings of 3D IMAX are presented in high frame rate (HFR).
            # The tickets for these screenings are appended with 'in HFR' on top of the IMAX identifier.
            #
            # Example:
            #     'Avatar: Fire and Ash - An IMAX 3D Experience® in HFR'
            separated = movie.split("An IMAX 3D Experience®")
            movie = remove_suffixes(separated[0], FORMAT_SEPARATORS)
            # append HFR if this is a HFR screening
            format += " 3D HFR" if "HFR" in separated[1] else " 3D"

        else:
            # This branch is only hit for unusual IMAX listings.
            # All we can really do is just consider everything before 'IMAX' the full movie name.
            #
            # This approach is not robust, but for 99% of the IMAX listings this branch won't be
            # reached. At least I hope:)
            #
            # Example:
            #     'Dune (2021) IMAX REISSUE'
            #
            # These can have 70MM variants.
            #
            # Example:
            #     'Sinners IMAX 70MM Film reissue'
            separated = movie.split("IMAX")
            movie = separated[0]
            format += " 70MM" if "70" in separated[1] else ""

    if "Special Engagement" in movie:
        # After IMAX, the next most common format screenings have 'Special Engagement' in the title.
        # This is most commonly found in listings of movies shown on 70MM film.
        #
        # Example:
        #'Kill Bill: The Whole Bloody Affair - Special Engagement 70mm'
        separated = movie.split("Special Engagement")
        movie = remove_suffixes(separated[0], FORMAT_SEPARATORS)
        format = "70MM" if "70" in separated[1] else format

    # Rereleases may have the original release year in a pair of parenthesis after the movie name.
    # Therefore, we need to remove these.
    # This implementation does not check the actual contents of the parenthesis before discarding.
    #
    # Example:
    # 'Dune (2021) IMAX REISSUE' on reaching at this point will become:
    # 'Dune (2021)'
    paranthesis = re.search("\\(.*\\)", movie, re.DOTALL)
    if paranthesis:
        movie = movie[: paranthesis.start()]

    # Anniversary rereleases may include additional anniversary information after the movie name.
    # We need to remove that.
    #
    # Example:
    #'Back To The Future: 40th Anniversary – The IMAX Experience®' on reaching at this point will become:
    #'Back To The Future: 40th Anniversary'
    #
    #'Top Gun - 40th Anniversary'
    anniversary = re.search("\\d*(st|nd|rd|th)? anniversary", movie, re.IGNORECASE)
    if anniversary:
        movie = movie[: anniversary.start()]

    # remove any remaining suffixes
    return remove_suffixes(movie, FORMAT_SEPARATORS), format


def parse_datetime(s: str) -> datetime:
    """Parses date and time in the following format:
    'Friday, September 11, 2026 - 7:00 PM'

    The time is assumed to be in the local machine timezone.
    """

    # Parsing identifiers and their meanings: https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior
    return datetime.strptime(s, "%A, %B %d, %Y - %I:%M %p").astimezone()


def parse_format(s: str) -> str:
    """Parses movie screening format from a row-seat line in the following format:
    'IMAX Row H - Seat 17 CineClub Member-Priced $19.99'

    Other examples:
    'Cinema 7 (2nd level) Row F - Seat 1 CineClub Member $0.00'
    'AVX #9 (2nd level) Row B - Seat 10 CineClub Member-Priced $14.99'
    """

    room = s.split("Row", maxsplit=1)[0].lower()  # before row

    if "avx" in room:
        return "AVX"

    if "imax" in room:
        return "IMAX"

    if "4dx" in room:
        return "4DX"

    if "vip" in room:
        return "VIP"

    if "screenx" in room:
        return "ScreenX"

    # uncomment the following if default return is ever changed
    # if "cinema" in room or "aud" in room or "d-box" in room:
    #     return "Regular"

    return "Regular"


def parse_seat(s: str) -> str:
    """Parses seat row and number in the following format:
    'IMAX Row H - Seat 17 CineClub Member-Priced $19.99'

    Returns a seat number like: 'H17'
    """

    row_separated = s.split("Row", 1)
    seat_separated = s.split("Seat", 1)

    if len(row_separated) != 2 or len(seat_separated) != 2:
        raise ValueError(f"failed to extract row and seat information from: \n{s}")

    row = row_separated[1].strip().split()[0].upper()
    num = seat_separated[1].strip().split()[0]

    return row + num
