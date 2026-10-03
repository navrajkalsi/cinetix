import type Booking from "../models/Booking";

export async function getBookings(year: number | null): Promise<Booking[]> {
  const response = await fetch(
    year ? `/api/bookings/${year}` : "/api/bookings",
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);
  }

  return response.json();
}
