import { useRef } from "react";
import { useLoaderData } from "react-router";
import { parseISO } from "date-fns";
import BookingCard from "@/components/BookingCard";
import useBookingComplete from "@/hooks/useBookingCompelete";
import type { LoaderData } from "@/loaders";

export type BookingsData = Extract<LoaderData, { path: "bookings" }>;

export default function Bookings() {
  // bookings fetched during routing
  const { bookings, filters }: BookingsData = useLoaderData();

  const upcomingBookings = bookings
    .filter((booking) => parseISO(booking.date) > new Date())
    .map(useBookingComplete),
    pastBookings = bookings
      .filter((booking) => parseISO(booking.date) <= new Date())
      .map(useBookingComplete);

  const startLeft = useRef<number>(0); // for offsettting the sidebar width
  const scrollOffset = useRef<number>(0);

  function handleWheel(e: React.WheelEvent<HTMLElement>) {
    const main = e.currentTarget;

    if (!startLeft.current)
      startLeft.current = main.getBoundingClientRect().left;

    const currentOffset = scrollOffset.current,
      // clamped to bounds
      newOffset = Math.max(
        Math.min(currentOffset - e.deltaY - e.deltaX, 0),
        window.innerWidth > main.scrollWidth
          ? 0
          : window.innerWidth - main.scrollWidth - startLeft.current,
      );

    main.style.setProperty("translate", `${newOffset}px 0`);
    scrollOffset.current = newOffset;
  }

  return (
    <div className="size-full overflow-hidden">
      <div
        onWheel={handleWheel}
        className="w-fit h-full flex py-25 px-12.5 gap-12.5 duration-300"
      >
        {upcomingBookings.map((booking) => (
          <BookingCard booking={booking} key={booking.id} />
        ))}

        {pastBookings.map((booking) => (
          <BookingCard booking={booking} key={booking.id} />
        ))}
      </div>
    </div>
  );
}
