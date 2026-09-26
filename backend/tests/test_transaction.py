from pdf.transaction import parse_movie_format

# dict with following shape:
# input: expected output
TEST_CASES = {
    ("The Odyssey", "Cinema 7"): (
        "The Odyssey",
        "Regular",
    ),
    ("The Odyssey - The IMAX Experience®", "IMAX"): (
        "The Odyssey",
        "IMAX",
    ),
    ("The Odyssey: The IMAX Experience® in 70MM Film", "IMAX"): (
        "The Odyssey",
        "IMAX 70MM",
    ),
    ("Kill Bill: The Whole Bloody Affair - Special Engagement 70mm", "Regular"): (
        "Kill Bill: The Whole Bloody Affair",
        "70MM",
    ),
    ("Back To The Future: 40th Anniversary - The IMAX Experience®", "IMAX"): (
        "Back To The Future",
        "IMAX",
    ),
    ("Top Gun - 40th Anniversary", "Regular"): (
        "Top Gun",
        "Regular",
    ),
    ("Dune (2021) IMAX REISSUE", "Regular"): (
        "Dune",
        "IMAX",
    ),
    ("Avatar: Fire and Ash - An IMAX 3D Experience® in HFR", "IMAX"): (
        "Avatar: Fire and Ash",
        "IMAX 3D HFR",
    ),
}


def test_parse_format():
    for input, expected in TEST_CASES.items():
        movie, format = parse_movie_format(input[0], input[1])
        assert movie == expected[0]
        print(input, expected, (movie, format))
        # assert format == expected[1]
