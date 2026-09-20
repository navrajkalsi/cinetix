import type Movie from "../models/Movie";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch("/api/movies");

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  return response.json();
}
