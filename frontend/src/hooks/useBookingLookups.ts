import type { Booking } from "../models/Booking";
import type { Format } from "../models/Format";
import type { Location } from "../models/Location";
import type { Movie } from "../models/Movie";
import useFormat from "./useFormat";
import useLocation from "./useLocation";
import useMovie from "./useMovie";

export default function useBookingLookups(
  booking: Booking,
): [Movie, Location, Format] {
  const movie = useMovie(booking.movie_id);
  const location = useLocation(booking.location_id);
  const format = useFormat(booking.format_id);

  return [movie, location, format];
}
