import type Format from "./Format";
import type Location from "./Location";
import type Movie from "./Movie";

export default interface Booking {
  id: number;
  booking_id: string;
  datetime: string;
  seats: string;
  price: number;
  movie: Movie;
  location: Location;
  format: Format;
}
