import { useRef } from "react";
import "./../../App.css";
import type Booking from "../../models/Booking";
import Nav from "../../components/Nav";
import List from "../../components/List";
import { useLoaderData } from "react-router";

export default function Bookings() {
  // bookings fetched during routing
  const { year, bookings }: { year: number | null; bookings: Booking[] } =
    useLoaderData();

  const upcomingBookings = year
    ? null
    : bookings.filter(
      (booking) => new Date(booking.datetime) > new Date(2026, 9, 1),
    ),
    pastBookings = year
      ? bookings
      : bookings.filter((booking) => new Date(booking.datetime) <= new Date());

  // main div element for scroll offset setting
  const main = useRef<HTMLDivElement>(null);
  const scrollOffset = useRef<number>(0);

  function handleWheel(e: React.WheelEvent<HTMLElement>) {
    if (main.current === null) {
      return;
    }

    const currentOffset = scrollOffset.current,
      // clamped to bounds
      newOffset = Math.max(
        Math.min(currentOffset - e.deltaY - e.deltaX, 0),
        window.innerWidth > main.current.scrollWidth
          ? 0
          : window.innerWidth - main.current.scrollWidth,
      );

    main.current.style.setProperty("translate", `${newOffset}px 0`);
    scrollOffset.current = newOffset;
  }

  const list =
    bookings.length > 0 ? (
      upcomingBookings && upcomingBookings.length > 0 ? (
        <>
          <List upcoming={true} bookings={upcomingBookings} />
          <List upcoming={false} bookings={pastBookings} />
        </>
      ) : (
        <List bookings={pastBookings} />
      )
    ) : (
      <p>No Bookings Found</p>
    );

  return (
    <div id="main" ref={main} onWheel={handleWheel}>
      <Nav />
      {list}
    </div>
  );
}
