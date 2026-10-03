import "./List.css";
import ListItem from "./ListItem.tsx";
import type Booking from "./../models/Booking.ts";

export default function List({
  upcoming,
  bookings,
}: {
  upcoming?: boolean;
  bookings: Booking[];
}) {
  let indicator = null;

  if (upcoming !== null) {
    indicator = (
      <span
        className={
          upcoming === true ? "indicator upcoming" : "indicator recent"
        }
      ></span>
    );
  }

  return (
    <div className="list-container">
      <div className={upcoming === true ? "list upcoming" : "list"}>
        {bookings.map((booking) => (
          <ListItem
            upcoming={upcoming && upcoming === true ? true : false}
            key={booking.id}
            booking={booking}
          />
        ))}
      </div>
      {indicator}
    </div>
  );
}
