import { useEffect, useState } from "react";

// This reducer only mutates the state for Movies in the database.
// For fetching movies from external site(TMDB) see the useTMDB hook.

type Action = {
  type:

};

export function moviesReducer(searchTerm?: string): [string[], boolean] {
  const database = "/api/movies?names_only=true";

  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    setLoading(true);
  }, [searchTerm]);

  return [movies, loading];
}
