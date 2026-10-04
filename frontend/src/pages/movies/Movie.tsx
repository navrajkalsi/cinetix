import { useLoaderData } from "react-router";
import type Booking from "../../models/Booking";
import type Movie from "../../models/Movie";
import "./Movie.css";
import CardLandscape from "../../components/CardLandscape";

export default function Movie() {
  // movie and bookings fetched during routing
  const { movie, bookings }: { movie: Movie; bookings: Booking[] } =
    useLoaderData();

  return (
    <div className="movie">
      <div className="movie-info">
        <div className="title">{movie.name}</div>

        <div className="visits">
          <span className="visits-count">{bookings.length}</span>
          {bookings.length > 1 ? " bookings " : " booking "}found for this
          movie.
        </div>

        <div className="movie-bookings">
          {bookings.map((booking) => (
            <CardLandscape
              booking={booking}
              key={booking.id}
              suppress="movie"
            />
          ))}
        </div>
      </div>

      <div className="movie-poster">
        <img src={movie.poster_url} />
      </div>
    </div>
  );
}
