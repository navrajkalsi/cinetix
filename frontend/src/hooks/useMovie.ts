import type { Movie } from "../models/Movie";
import useLookupsContext from "./useLookupsContext";

export default function useMovie(id: number): Movie {
  const { lookups } = useLookupsContext();
  const movie = lookups.movies.get(id);

  if (!movie) throw new Response("movie id for a booking must exist");

  return movie;
}
