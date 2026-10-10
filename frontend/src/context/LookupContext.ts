import { createContext } from "react";
import type { Movie } from "../models/Movie";
import type { Location } from "../models/Location";
import type { Format } from "../models/Format";

export interface Lookups {
  movies: Map<number, Movie>;
  locations: Map<number, Location>;
  formats: Map<number, Format>;
}

// Type stored in the context
export interface LookupsContextState {
  lookups: Lookups;
  refresh: () => Promise<void>;
}

export const LookupsContext = createContext<LookupsContextState | null>(null);
