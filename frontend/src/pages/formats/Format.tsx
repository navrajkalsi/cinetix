import { useLoaderData } from "react-router";
import "./Format.css";
import CardLandscape from "../../components/CardLandscape";
import type { Booking } from "../../models/Booking";
import useFormat from "../../hooks/useFormat";
import useBookingCompletes from "../../hooks/useBookingCompletes";

export default function Format() {
  // formatid and bookings fetched during routing
  const { formatId, bookings }: { formatId: number; bookings: Booking[] } =
    useLoaderData();

  const format = useFormat(formatId);
  const bookingCompletes = useBookingCompletes(bookings);

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
        {bookingCompletes.map((booking) => (
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
