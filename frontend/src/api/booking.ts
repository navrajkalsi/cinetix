import type Booking from "../models/Booking";

export default async function getBookings({
  year,
  movieId,
  locationId,
  formatId,
  includeFuture,
}: {
  year?: number;
  movieId?: number;
  locationId?: number;
  formatId?: number;
  includeFuture?: boolean;
}): Promise<Booking[]> {
  const response = await fetch(
    `/api/bookings/?${year ? `year=${year}&` : ""}${movieId ? `movie=${movieId}&` : ""}${locationId ? `location=${locationId}&` : ""}${formatId ? `format=${formatId}&` : ""}${includeFuture ? `future=${includeFuture}` : ""}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);
  }

  return response.json();
}
