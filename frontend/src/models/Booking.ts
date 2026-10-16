import type { Format } from "./Format";
import type { Location } from "./Location";
import { type MovieCreate, type Movie } from "./Movie";
import z from "zod";

// Model with common fields for all booking models.
interface BookingBase {
  external_id: string | null;
  date_time: Date;
  seats: string[];
  price: number | null;
  movie_id: number;
  location_id: number;
  format_id: number;
  source: "manual" | "auto" | "auto_edit";
}

// Model recived from database api
export interface Booking extends BookingBase {
  id: number;
}

// Model for creating a new booking in the database from user input
export interface BookingCreate extends BookingBase { }

// Model with included references
export interface BookingComplete extends Booking {
  movie: Movie;
  location: Location;
  format: Format;
}

// // Validation schema for add a new booking via form input.
// export const BookingNew: z.ZodType<BookingCreate> = z.object({
//   movie: z.custom<MovieCreate>((m) => m);
// });
