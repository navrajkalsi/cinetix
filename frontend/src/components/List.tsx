import { useRef } from "react";
import "./List.css";
import type BookingModel from "../models/Booking";
import Booking from "./Booking";

export default function List({ items }: { items: Array<BookingModel> }) {
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
      <Booking booking={item} />
    </li>
  ));

  return (
    <section onWheel={handleScroll}>
      <ul ref={list}>{list_items}</ul>
    </section>
  );
}
