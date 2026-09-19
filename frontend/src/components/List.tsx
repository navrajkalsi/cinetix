import { useRef } from "react";
import "./List.css";
import type Booking from "../models/Booking";

export default function List({ items }: { items: Array<Booking> }) {
  const list = useRef<HTMLUListElement>(null);

  function handleScroll(e: React.WheelEvent<HTMLElement>) {
    if (list.current == null) {
      return;
    }

    const currentOffset = parseInt(list.current.style.left, 10),
      // clamped to bounds
      newOffset = Math.max(
        Math.min(
          (isNaN(currentOffset) ? 0 : currentOffset) - e.deltaY - e.deltaX,
          0,
        ),
        window.innerWidth - list.current.scrollWidth,
      );

    list.current.style.setProperty("left", `${newOffset}px`);
  }

  const list_items = items.map((item) => (
    <li key={item.id}>
      ID: {item.id}
      <br />
      Booking ID: {item.booking_id}
      <br />
      Datetime: {item.datetime}
      <br />
      Seats: {item.seats}
      <br />
      Price: {item.price}
      <br />
      Movie: {item.movie}
      <br />
      Location: {item.location}
      <br />
      Format: {item.format}
    </li>
  ));

  return (
    <section onWheel={handleScroll}>
      <ul ref={list}>{list_items}</ul>
    </section>
  );
}
