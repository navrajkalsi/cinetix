export default interface Stats {
  year: number | null;
  bookings: number;
  movies: number;
  locations: number;
  formats: number;
  minutes: number;
  bookings_without_minutes: number;
  cost: number;
  bookings_without_cost: number;
  movie_id: number;
  location_id: number;
  format_id: number;
}
