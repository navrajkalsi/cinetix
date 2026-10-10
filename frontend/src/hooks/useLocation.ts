import type { Location } from "../models/Location";
import useLookupsContext from "./useLookupsContext";

export default function useLocation(id: number): Location {
  const { lookups } = useLookupsContext();
  const location = lookups.locations.get(id);

  if (!location) throw new Response("location id for a booking must exist");

  return location;
}
