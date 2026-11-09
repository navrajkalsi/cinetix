const FilterLiterals = ["year", "movieId", "locationId", "formatId"] as const;
export type Filter = (typeof FilterLiterals)[number];
export type Filters = Record<Filter, number | undefined>;

const yearPattern = /^\d{4}$/; // only 4 digits
const idPattern = /^\d+$/; // at least one digit

const parseYear = (s: string) => (yearPattern.test(s) ? Number(s) : undefined);
const parseId = (s: string) => (idPattern.test(s) ? Number(s) : undefined);

const parsers: Record<Filter, (s: string) => number | undefined> = {
  year: parseYear,
  movieId: parseId,
  locationId: parseId,
  formatId: parseId,
};

// Parses on the filters requested from the provided params
export function parseFilters(
  params: URLSearchParams,
  filters: Readonly<Filter[]>,
): Pick<Filters, Filter> {
  let out = {} as Pick<Filters, Filter>;

  for (const filter of filters) {
    const raw = params.get(filter);
    out[filter] = raw ? parsers[filter](raw) : undefined;
  }

  return out;
}

// filters for all pages
export const BookingsFilters = ["year"] as const,
  BookingFilters = [] as const,
  BookingNewFilters = [] as const,
  MovieFilters = ["locationId", "formatId"] as const,
  LocationFilters = ["year", "movieId", "formatId"] as const,
  FormatFilters = ["year", "movieId", "locationId"] as const;
