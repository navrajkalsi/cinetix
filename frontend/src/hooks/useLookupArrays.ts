import type { Movie } from "../models/Movie";
import type { Location } from "../models/Location";
import type { Format } from "../models/Format";
import useLookupsContext from "./useLookupsContext";

function compare<T extends Movie | Location | Format>(a: T, b: T): number {
  const nameA = a.name.toLowerCase(); // ignore case
  const nameB = b.name.toLowerCase(); // ignore case

  if (nameA < nameB) return -1;

  if (nameA > nameB) return 1;

  return 0;
}

export default function useLookupArrays(
  sort?: boolean,
): [Movie[], Location[], Format[]] {
  const { lookups } = useLookupsContext();

  const movies = Array.from(lookups.movies.values());
  const locations = Array.from(lookups.locations.values());
  const formats = Array.from(lookups.formats.values());

  if (sort && sort === true) {
    movies.sort(compare);
    locations.sort(compare);
    formats.sort(compare);
  }

  return [movies, locations, formats];
}
