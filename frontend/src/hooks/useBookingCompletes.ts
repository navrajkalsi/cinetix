import type { Booking, BookingComplete } from "../models/Booking";
import useBookingComplete from "./useBookingCompelete";

export default function useBookingCompletes(
  bookings: Booking[],
): BookingComplete[] {
  return bookings.map(useBookingComplete);
}
