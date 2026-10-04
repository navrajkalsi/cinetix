import type Movie from "../models/Movie";

export default async function getMovie(id: number): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch movie: ${response.statusText}`);
  }

  return response.json();
}
