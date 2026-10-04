import { useLoaderData } from "react-router";
import type Booking from "../../models/Booking";
import type Location from "../../models/Location";
import "./Location.css";
import CardLandscape from "../../components/CardLandscape";

export default function Location() {
  // location and bookings fetched during routing
  const { location, bookings }: { location: Location; bookings: Booking[] } =
    useLoaderData();

  return (
    <div className="location">
      <div className="location-info">
        <div className="title">{location.name}</div>

        <div className="visits">
          <span className="visits-count">{bookings.length}</span>
          {bookings.length > 1 ? " bookings " : " booking "}found at this
          location.
        </div>
      </div>

      <div className="location-bookings">
        {bookings.map((booking) => (
          <CardLandscape
            booking={booking}
            key={booking.id}
            suppress="location"
            posterUrl={new URL(booking.movie.poster_url)}
          />
        ))}
      </div>
    </div>
  );
}
