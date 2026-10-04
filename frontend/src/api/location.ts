import type Location from "../models/Location";

export default async function getMovie(id: number): Promise<Location> {
  const response = await fetch(`/api/locations/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch location: ${response.statusText}`);
  }

  return response.json();
}
