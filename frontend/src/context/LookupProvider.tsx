import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMovies } from "../api/movies";
import { getLocations } from "../api/locations";
import { getFormats } from "../api/formats";
import {
  LookupsContext,
  type Lookups,
  type LookupsContextState,
} from "./LookupContext";

async function fetchLookups(signal: AbortSignal): Promise<Lookups> {
  const [movies, locations, formats] = await Promise.all([
    getMovies(signal),
    getLocations(signal),
    getFormats(signal),
  ]);

  return {
    movies: new Map(movies.map((m) => [m.id, m])),
    locations: new Map(locations.map((l) => [l.id, l])),
    formats: new Map(formats.map((f) => [f.id, f])),
  };
}

export function LookupsProvider({ children }: { children: React.ReactNode }) {
  const [lookups, setLookups] = useState<Lookups | null>(null);
  const [error, setError] = useState<unknown>(null);
  const abortController = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;

    setError(null);

    try {
      const result = await fetchLookups(controller.signal);
      if (controller.signal.aborted) return; // do not update lookups if aborted
      setLookups(result);
    } catch (e) {
      if (controller.signal.aborted) return; // do not error if aborted
      console.error("Failed to fetch lookups data: ", e);
      setError(e);
    }
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
    return () => abortController.current?.abort();
  }, [refresh]);

  const value = useMemo<LookupsContextState | null>(
    () => (lookups ? { lookups, refresh } : null),
    [lookups, refresh],
  );

  if (!value) {
    return <h1> {error ? "error" : "loading"}</h1>;
  }

  return (
    <LookupsContext.Provider value={value}>{children}</LookupsContext.Provider>
  );
}
