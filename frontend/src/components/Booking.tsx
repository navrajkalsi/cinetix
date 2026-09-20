import type Booking from "../models/Booking";
import Field from "./Field";
import "./Booking.css";

export default function Booking({ booking }: { booking: Booking }) {
  const dateObj = new Date(booking.datetime);
  const date = dateObj.toDateString();
  const splitTime = dateObj.toLocaleTimeString().split(":");
  const time = splitTime[0] + ":" + splitTime[1] + splitTime[2].slice(2);

  return (
    <>
      <div className="booking-banner"></div>
      <div className="booking-fields">
        <Field name="Booking ID" value={booking.booking_id} />
        <Field name="Date" value={date} />
        <Field name="Time" value={time} />
        <Field name="Seats" value={booking.seats} />
        <Field name="Price" value={`$${booking.price.toString()}`} />
        <Field name="Movie" value={booking.movie.name} />
        <Field name="Location" value={booking.location.name} />
        <Field name="Format" value={booking.format.name} />
      </div>
    </>
  );
}
