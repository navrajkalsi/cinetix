import { err, type AppError, type Result } from "@/types";
import { type Location, type LocationCreate } from "../models/Location";
import { resolve } from "@/utils";

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

export async function getLocationMatches(
  searchTerm: string,
  signal?: AbortSignal,
): Promise<LocationCreate[]> {
  const response = await fetch(
    `/api/locations/search?search_term=${searchTerm}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch location matches: ${response.statusText}`);
  }

  return response.json();
}

export async function postLocation(model: LocationCreate): Promise<Location> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch("/api/locations/", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(model),
  });

  return response.json();
}

export async function fetchExternalLocations(
  searchTerm: string,
  signal: AbortSignal,
): Promise<Result<LocationCreate[], AppError>> {
  const params = new URLSearchParams({
    search_term: searchTerm.trim(),
  });

  const headers = new Headers({
    Accept: "application/json",
  });

  const [error, response] = await resolve(
    fetch(`/api/locations/search?${params}`, {
      signal,
      headers: headers,
    }),
    "Could not connect to server.",
  );

  if (error === null) {
    if (!response.ok)
      return err({ reason: `Request failed (${response.status}).` });

    return await resolve(response.json(), "Could not parse the response.");
  }

  return [error, null];
}
