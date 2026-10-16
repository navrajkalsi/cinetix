import { useRef, useState } from "react";
import { type Booking } from "../models/Booking";
import Field from "./Field";
import "./ListItem.css";
import useMovie from "../hooks/useMovie";
import useLocation from "../hooks/useLocation";
import useFormat from "../hooks/useFormat";

// list items apect ratio is decided based on the preferred aspect ratio of the movie posters from TMDB
// https://www.themoviedb.org/bible/image/59f7582c9251416e7100005f
export default function ListItem({
  upcoming,
  booking,
}: {
  upcoming: boolean;
  booking: Booking;
}) {
  const [active, setActive] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);

  const dateObj = new Date(booking.date_time);
  const date = dateObj.toDateString();
  const splitTime = dateObj.toLocaleTimeString().split(":");
  const time = splitTime[0] + ":" + splitTime[1] + splitTime[2].slice(2);

  const movie = useMovie(booking.movie_id);
  const location = useLocation(booking.location_id);
  const format = useFormat(booking.format_id);

  function toggleActive() {
    setActive((a) => !a);
  }

  return (
    <div className="card-container" ref={container}>
      <div
        className={
          active
            ? upcoming
              ? "card active upcoming"
              : "card active"
            : upcoming
              ? "card upcoming"
              : "card"
        }
        style={{ backgroundImage: `url(${movie.poster_url})` }}
        onClick={toggleActive}
      >
        <div className="fields">
          <Field name="Movie" value={movie.name} link={`/movies/${movie.id}`} />
          <Field
            name="Location"
            value={location.name}
            link={`/locations/${location.id}`}
          />
          <Field
            name="Format"
            value={format.name}
            link={`/formats/${format.id}`}
          />
          <Field name="Date" value={date} link={null} />
          <Field name="Time" value={time} link={null} />
          <Field name="Seats" value={booking.seats.join(", ")} link={null} />
          <Field name="Price" value={`$${booking.price}`} link={null} />
          <Field
            name="Booking ID"
            value={booking.external_id ? booking.external_id : ""}
            link={null}
          />
        </div>
      </div>
    </div>
  );
}
