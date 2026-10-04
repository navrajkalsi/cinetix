import type Booking from "../models/Booking";
import "./CardLandscape.css";
import Field from "./Field";

/// Card for displaying Movie, Location or Format info.

// Since this card will be shown for bookings for a movie, location or format's page
// this type can allow to hide a certain field from the resulting list
export type Suppress = "movie" | "location" | "format";

export default function CardLandscape({
  booking,
  suppress,
  posterUrl,
}: {
  booking: Booking;
  suppress: Suppress;
  posterUrl?: URL;
}) {
  const dateObj = new Date(booking.datetime);
  const date = dateObj.toDateString();
  const splitTime = dateObj.toLocaleTimeString().split(":");
  const time = splitTime[0] + ":" + splitTime[1] + splitTime[2].slice(2);

  return (
    <div className="card-landscape">
      <div className="fields">
        {suppress === "movie" ? (
          <></>
        ) : (
          <Field
            name="Movie"
            value={booking.movie.name}
            link={`/movies/${booking.movie.id}`}
          />
        )}
        {suppress === "location" ? (
          <></>
        ) : (
          <Field
            name="Location"
            value={booking.location.name}
            link={`/locations/${booking.location.id}`}
          />
        )}
        {suppress === "format" ? (
          <></>
        ) : (
          <Field
            name="Format"
            value={booking.format.name}
            link={`/formats/${booking.format.id}`}
          />
        )}
        <Field name="Date" value={date} link={null} />
        <Field name="Time" value={time} link={null} />
        <Field name="Price" value={`$${booking.price}`} link={null} />
        <Field name="Seats" value={booking.seats} link={null} />
        <Field name="Booking ID" value={booking.booking_id} link={null} />
      </div>

      {posterUrl ? (
        <div
          className="poster"
          style={{ backgroundImage: `url(${posterUrl.toString()}` }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  );
}
