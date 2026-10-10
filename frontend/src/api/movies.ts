import { type Movie } from "../models/Movie";

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
