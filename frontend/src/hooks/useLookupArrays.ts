import type { Movie } from "../models/Movie";
import type { Location } from "../models/Location";
import type { Format } from "../models/Format";
import useLookupsContext from "./useLookupsContext";
import { useMemo } from "react";

function compare<T extends Movie | Location | Format>(a: T, b: T): number {
  const nameA = a.name.toLowerCase(); // ignore case
  const nameB = b.name.toLowerCase(); // ignore case

  if (nameA < nameB) return -1;

  if (nameA > nameB) return 1;

  return 0;
}

// returns memoized version that are stable and only change when the underlying data changes and do
// not return new references for the same data.
export default function useLookupArrays(
  sort?: boolean,
): [Movie[], Location[], Format[]] {
  const { lookups } = useLookupsContext();

  const movies = useMemo(() => {
    const result = Array.from(lookups.movies.values());
    return sort ? result.sort(compare) : result;
  }, [lookups.movies, sort]);

  const locations = useMemo(() => {
    const result = Array.from(lookups.locations.values());
    return sort ? result.sort(compare) : result;
  }, [lookups.locations, sort]);

  const formats = useMemo(() => {
    const result = Array.from(lookups.formats.values());
    return sort ? result.sort(compare) : result;
  }, [lookups.formats, sort]);

  return [movies, locations, formats];
}
