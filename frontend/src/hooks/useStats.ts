import type { Stats, StatsFull } from "@/models/Stats";
import useLookupsContext from "./useLookupsContext";
import type { Movie } from "@/models/Movie";
import type { Location } from "@/models/Location";
import type { Format } from "@/models/Format";

export default function useStats(stats?: Stats): StatsFull | undefined {
  const { lookups } = useLookupsContext();
  if (!stats) return stats;

  const movies: [Movie, number][] = stats.most_watched_movies
    .map(([id, times]): [Movie | undefined, number] => [
      lookups.movies.get(id),
      times,
    ])
    .filter((entry): entry is [Movie, number] => entry[0] !== undefined);
  const locations: [Location, number][] = stats.most_visited_locations
    .map(([id, times]): [Location | undefined, number] => [
      lookups.locations.get(id),
      times,
    ])
    .filter((entry): entry is [Location, number] => entry[0] !== undefined);
  const formats: [Format, number][] = stats.most_experienced_formats
    .map(([id, times]): [Format | undefined, number] => [
      lookups.formats.get(id),
      times,
    ])
    .filter((entry): entry is [Format, number] => entry[0] !== undefined);

  const ret: StatsFull = {
    ...stats,
    most_watched_movies: movies,
    most_visited_locations: locations,
    most_experienced_formats: formats,
  };
  return ret;
}
