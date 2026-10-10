import { Link, useLoaderData } from "react-router";
import "./Movie.css";
import CardLandscape from "../../components/CardLandscape";
import type { Booking } from "../../models/Booking.js";
import useMovie from "../../hooks/useMovie.js";

export default function Movie() {
  // movieid and bookings fetched during routing
  const { movieId, bookings }: { movieId: number; bookings: Booking[] } =
    useLoaderData();

  const movie = useMovie(movieId);
  const tmdbUrl = new URL(
    `https://www.themoviedb.org/movie/${movie.external_id}`,
  );

  return (
    <div className="movie">
      <div className="movie-info">
        <div className="title" title="Visit the TMDB page for this movie.">
          <Link to={tmdbUrl.toString()} className="link">
            {movie.name}
          </Link>
        </div>

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
