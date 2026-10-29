import { type Booking, type BookingCreate } from "../models/Booking";

export async function getBooking(
  id: number,
  signal?: AbortSignal,
): Promise<Booking> {
  const response = await fetch(`/api/bookings/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch booking: ${response.statusText}`);
  }

  return response.json();
}

export async function getBookings({
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

  if (!response.ok)
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);

  return response.json();
}

export async function postBooking(model: BookingCreate): Promise<Booking> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch("/api/bookings/", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(model),
  });

  if (!response.ok)
    throw new Error(`Failed to add booking: ${response.statusText}`);

  return response.json();
}
