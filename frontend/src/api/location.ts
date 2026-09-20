import type Location from "../models/Location";

export async function getLocations(): Promise<Location[]> {
  const response = await fetch("/api/locations");

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
}
