import { useState } from "react";
import type Booking from "../models/Booking";
import Field from "./Field";
import "./ListItem.css";

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

  const dateObj = new Date(booking.datetime);
  const date = dateObj.toDateString();
  const splitTime = dateObj.toLocaleTimeString().split(":");
  const time = splitTime[0] + ":" + splitTime[1] + splitTime[2].slice(2);

  function toggleActive() {
    setActive((a) => !a);
  }

  return (
    <div className="card-container">
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
        style={{ backgroundImage: `url(${booking.movie.poster_url})` }}
        onClick={toggleActive}
      >
        <div className="fields">
          <Field
            name="Movie"
            value={booking.movie.name}
            link="https://navrajkalsi.com"
          />
          <Field
            name="Location"
            value={booking.location.name}
            link="https://navrajkalsi.com"
          />
          <Field
            name="Format"
            value={booking.format.name}
            link="https://navrajkalsi.com"
          />
          <Field name="Date" value={date} link={null} />
          <Field name="Time" value={time} link={null} />
          <Field name="Seats" value={booking.seats} link={null} />
          <Field
            name="Price"
            value={`$${booking.price.toString()}`}
            link={null}
          />
          <Field name="Booking ID" value={booking.booking_id} link={null} />
        </div>
      </div>
    </div>
  );
}
