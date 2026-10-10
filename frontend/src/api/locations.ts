import { type Location } from "../models/Location";

export default async function getMovie(
  id: number,
  signal?: AbortSignal,
): Promise<Location> {
  const response = await fetch(`/api/locations/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch location: ${response.statusText}`);
  }

  return response.json();
}

export async function getLocations(signal?: AbortSignal): Promise<Location[]> {
  const response = await fetch(`/api/locations/`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
}
