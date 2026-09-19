import type Booking from "../models/Booking";
import Field from "./Field";

export default function Booking({ booking }: { booking: Booking }) {
  return (
    <div>
      <Field name="ID" value={booking.booking_id} />
      <Field name="Date" value={booking.datetime} />
      <Field name="Seats" value={booking.seats} />
      <Field name="Price" value={booking.price.toString()} />
      <Field name="Movie" value={booking.movie.name} />
      <Field name="Location" value={booking.location.name} />
      <Field name="Format" value={booking.format.name} />
    </div>
  );
}
