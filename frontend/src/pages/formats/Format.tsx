import { useLoaderData } from "react-router";
import type Booking from "../../models/Booking";
import "./Format.css";
import CardLandscape from "../../components/CardLandscape";
import type Format from "../../models/Format";

export default function Format() {
  // format and bookings fetched during routing
  const { format, bookings }: { format: Format; bookings: Booking[] } =
    useLoaderData();

  return (
    <div className="format">
      <div className="format-info">
        <div className="title">{format.name}</div>

        <div className="visits">
          <span className="visits-count">{bookings.length}</span>
          {bookings.length > 1 ? " bookings " : " booking "}found for this
          format.
        </div>
      </div>

      <div className="format-bookings">
        {bookings.map((booking) => (
          <CardLandscape
            booking={booking}
            key={booking.id}
            suppress="format"
            posterUrl={new URL(booking.movie.poster_url)}
          />
        ))}
      </div>
    </div>
  );
}
