import type { Booking, BookingComplete } from "../models/Booking";
import useFormat from "./useFormat";
import useLocation from "./useLocation";
import useMovie from "./useMovie";

export default function useBookingComplete(booking: Booking): BookingComplete {
  const movie = useMovie(booking.movie_id);
  const location = useLocation(booking.location_id);
  const format = useFormat(booking.format_id);

  return { ...booking, movie, location, format };
}
