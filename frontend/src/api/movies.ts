import { err, type AppError, type Result } from "@/types";
import { type Movie, type MovieCreate } from "../models/Movie";
import { resolve } from "@/utils";

export async function getMovie(
  id: number,
  signal?: AbortSignal,
): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie: ${response.statusText}`);
  }

  return response.json();
}

export async function getMovies(signal?: AbortSignal): Promise<Movie[]> {
  const response = await fetch(`/api/movies/`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  return response.json();
}

export async function getMovieMatches(
  searchTerm: string,
  signal?: AbortSignal,
): Promise<MovieCreate[]> {
  const response = await fetch(`/api/movies/search?search_term=${searchTerm}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie matches: ${response.statusText}`);
  }

  return response.json();
}

export async function postMovie(model: MovieCreate) {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch("/api/movies/", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(model),
  });

  return response.json();
}

export async function fetchExternalMovies(
  searchTerm: string,
  signal: AbortSignal,
): Promise<Result<MovieCreate[], AppError>> {
  const params = new URLSearchParams({
    search_term: searchTerm.trim(),
  });

  const headers = new Headers({
    Accept: "application/json",
  });

  const [error, response] = await resolve(
    fetch(`/api/movies/search?${params}`, {
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
