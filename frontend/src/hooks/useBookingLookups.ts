import type { Booking } from "../models/Booking";
import type { Format } from "../models/Format";
import type { Location } from "../models/Location";
import type { Movie } from "../models/Movie";
import useLookupsContext from "./useLookupsContext";

export default function useBookingLookups(
  booking: Booking,
): [Movie, Location, Format] {
  const { lookups } = useLookupsContext();
  const movie = lookups.movies.get(booking.movie_id);
  const location = lookups.locations.get(booking.location_id);
  const format = lookups.formats.get(booking.format_id);

  if (!movie || !location || !format)
    throw new Response("lookup ids for a booking must exist");

  return [movie, location, format];
}
