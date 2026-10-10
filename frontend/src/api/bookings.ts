import { type Booking } from "../models/Booking";

export default async function getBookings({
  year,
  movieId,
  locationId,
  formatId,
  includeFuture,
  signal,
}: {
  year?: number;
  movieId?: number;
  locationId?: number;
  formatId?: number;
  includeFuture?: boolean;
  signal?: AbortSignal;
}): Promise<Booking[]> {
  const response = await fetch(
    `/api/bookings/?${year ? `year=${year}&` : ""}${movieId ? `movie_id=${movieId}&` : ""}${locationId ? `location_id=${locationId}&` : ""}${formatId ? `format_id=${formatId}&` : ""}${includeFuture ? `future=${includeFuture}` : ""}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);
  }

  return response.json();
}
