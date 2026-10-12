import { Link, useLoaderData } from "react-router";
import "./Location.css";
import CardLandscape from "../../components/CardLandscape";
import useLocation from "../../hooks/useLocation";
import type { Booking } from "../../models/Booking";
import useBookingCompletes from "../../hooks/useBookingCompletes";

const mapsApiKey = "AIzaSyBXmTWlDVPBKtxFm2pejH0CII8jGJZ6vvU";

export default function Location() {
  // locationid and bookings fetched during routing
  const { locationId, bookings }: { locationId: number; bookings: Booking[] } =
    useLoaderData();

  const location = useLocation(locationId);
  const bookingCompletes = useBookingCompletes(bookings);
  const mapsUrl = new URL(
    `https://www.google.com/maps/search/?api=1&query=${location.name}&query_place_id=${location.external_id}`,
  );

  return (
    <div className="location">
      <div className="location-info">
        <div
          className="title"
          title="Visit the Google Maps page for this location."
        >
          <Link to={mapsUrl.toString()} className="link">
            {location.name}
          </Link>
        </div>

        <div className="visits">
          <span className="visits-count">{bookings.length}</span>
          {bookings.length > 1 ? " bookings " : " booking "}found at this
          location.
        </div>

        <div className="location-bookings">
          {bookingCompletes.map((booking) => (
            <CardLandscape
              booking={booking}
              key={booking.id}
              suppress="location"
              posterUrl={new URL(booking.movie.poster_url)}
            />
          ))}
        </div>
      </div>

      <div className="location-map">
        <iframe
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?q=place_id:${location.external_id}&key=${mapsApiKey}`}
        >
          Loading...
        </iframe>
      </div>
    </div>
  );
}
