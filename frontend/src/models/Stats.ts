import type { Format } from "./Format";
import type { Location } from "./Location";
import type { Movie } from "./Movie";

export interface StatsBase {
  year: number | null;
  bookings: number;
  movies: number;
  locations: number;
  formats: number;
  minutes: number;
  bookings_without_minutes: number;
  cost: number;
  bookings_without_cost: number;
}

export interface Stats extends StatsBase {
  most_watched_movies: [number, number][];
  most_visited_locations: [number, number][];
  most_experienced_formats: [number, number][];
}

export interface StatsFull extends StatsBase {
  most_watched_movies: [Movie, number][];
  most_visited_locations: [Location, number][];
  most_experienced_formats: [Format, number][];
}
