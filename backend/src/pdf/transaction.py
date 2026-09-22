from datetime import datetime
from decimal import Decimal


# here is a sample transaction_string
"""
Date of Purchase: Thursday, September 10, 2026 - 8:24 PM
Transaction receipt: 16653761
Booking ID: WS22XD4
Theater Location: Cineplex Cinemas Mississauga Square One
Film/Performance: The Odyssey: The IMAX Experience® in 70MM Film
Date/Time: Friday, September 11, 2026 - 7:00 PM
Rating: PG
Number of tickets: 2
AUDITORIUM SEATS TICKETS PRICE
IMAX Row H - Seat 17 CineClub Member-Priced $19.99
IMAX Row H - Seat 16 CineClub Member-Priced $19.99
Online booking fee (non-refundable): $0.00
CineClub Discount: -$0.00
GST/HST: $5.20
Total: $45.18
Amex FrEEReee 487 9: -$45.18
Balance Due: $0.00
Scene+ card: 604646 *** *** 0 805
Collected points: 240
GST/HST # 83454 5543 RT0001
"""


class Transaction:
    id: str
    location: str
    movie: str
    dt: datetime
    format: str
    seats: list[str]
    price: Decimal

    def __init__(self, transaction_string: str) -> None:
        fields = transaction_string.splitlines()

        self.id = fields[2].split(":")[1].strip()
        self.location = fields[3].split(":")[1].strip()

        pass
