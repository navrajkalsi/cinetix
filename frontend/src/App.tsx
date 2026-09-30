import { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import List from "./components/List";
import "./App.css";
import type Booking from "./models/Booking";
import { getBookings } from "./api/booking";

export default function App() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const main = useRef<HTMLElement>(null);
  const scrollOffset = useRef<number>(0);

  function handleScroll(e: React.WheelEvent<HTMLElement>) {
    if (main.current == null) {
      return;
    }

    const currentOffset = scrollOffset.current,
      // clamped to bounds
      newOffset = Math.max(
        Math.min(
          (isNaN(currentOffset) ? 0 : currentOffset) - e.deltaY - e.deltaX,
          0,
        ),
        window.innerWidth > main.current.scrollWidth
          ? 0
          : window.innerWidth - main.current.scrollWidth,
      );

    main.current.style.setProperty("left", `${newOffset}px`);
    scrollOffset.current = newOffset;
  }

  function refreshData() {
    getBookings().then(setBookings).catch(console.error);
  }

  // start with all bookings and no filters
  useEffect(refreshData, []);

  return bookings === null ? (
    <main id="loading">Loading Data</main>
  ) : (
    <main ref={main} onWheel={handleScroll}>
      <Nav />
      <List bookings={bookings} />
    </main>
  );
}
