import "./List.css";
import ListItem from "./ListItem.tsx";
import type Booking from "./../models/Booking.ts";

export default function List({ bookings }: { bookings: Booking[] }) {
  return (
    <ul>
      {bookings.map((booking) => (
        <ListItem key={booking.id} booking={booking} />
      ))}
    </ul>
  );
}
