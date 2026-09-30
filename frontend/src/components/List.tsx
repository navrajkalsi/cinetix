import "./List.css";
import ListItem from "./ListItem.tsx";
import type Booking from "./../models/Booking.ts";

// list items apect ratio is decided based on the preferred aspect ratio of the movie posters from TMDB
// https://www.themoviedb.org/bible/image/59f7582c9251416e7100005f
export default function List({ bookings }: { bookings: Booking[] }) {
  return (
    <ul>
      {bookings.map((booking) => (
        <li
          key={booking.id}
          style={{ backgroundImage: `url(${booking.movie.poster_url})` }}
        >
          <ListItem booking={booking} />
        </li>
      ))}
    </ul>
  );
}
