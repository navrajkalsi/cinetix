"""PDF

This module is used to read, scan and parse a ticket booking confirmation.
This confirmation contains a transaction receipt with all the informaton required to create a
`Booking`.

The final parsed receipt is represented as a `Transaction` which can be added to the database as a
`Booking`.
"""

import sys
from pathlib import Path

from .transaction import Transaction


def from_args() -> Transaction:
    args = sys.argv
    if len(args) != 2:
        raise ValueError("invalid number of arguments supplied")

    return Transaction.from_pdf(Path(args[1]))


if __name__ == "__main__":
    print(from_args())
