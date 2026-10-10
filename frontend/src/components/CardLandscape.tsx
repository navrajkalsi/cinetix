import useBookingLookups from "../hooks/useBookingLookups";
import type { Booking } from "../models/Booking";
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
  const [movie, location, format] = useBookingLookups(booking);

  const dateObj = new Date(booking.date_time);
  const date = dateObj.toDateString();
  const splitTime = dateObj.toLocaleTimeString("en-US").split(":"); // Expected output: "1:15:30 AM"
  const time = splitTime[0] + ":" + splitTime[1] + splitTime[2].slice(2); // skip seconds

  return (
    <div className="card-landscape">
      <div className="fields">
        {suppress === "movie" ? (
          <></>
        ) : (
          <Field
            name="Movie"
            value={movie.name}
            link={`/movies/${booking.movie_id}`}
          />
        )}

        {suppress === "location" ? (
          <></>
        ) : (
          <Field
            name="Location"
            value={location.name}
            link={`/locations/${booking.location_id}`}
          />
        )}

        {suppress === "format" ? (
          <></>
        ) : (
          <Field
            name="Format"
            value={format.name}
            link={`/formats/${booking.format_id}`}
          />
        )}
        <Field name="Date" value={date} link={null} />
        <Field name="Time" value={time ? time : ""} link={null} />
        <Field name="Price" value={`$${booking.price}`} link={null} />
        <Field name="Seats" value={booking.seats.join(", ")} link={null} />
        <Field
          name="Booking ID"
          value={booking.external_id ? booking.external_id : ""}
          link={null}
        />
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
