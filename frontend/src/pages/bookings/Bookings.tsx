import { useLoaderData } from "react-router";
import { parseISO } from "date-fns";
import BookingCard from "@/components/BookingCard";
import useBookingComplete from "@/hooks/useBookingCompelete";
import type { LoaderData } from "@/loaders";
import { FilterText } from "@/components/FilterText";
import EmtpyBookings from "@/components/EmptyBookings";
import { useEffect, useRef } from "react";

export type BookingsData = Extract<LoaderData, { path: "bookings" }>;
const today = new Date();

export default function Bookings() {
  // bookings fetched during routing
  const { bookings, filters, future }: BookingsData = useLoaderData();
  const list = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (list.current) list.current.scrollLeft = 0;
  }, [bookings, filters]);

  if (!bookings.length)
    return <EmtpyBookings filters={filters} future={future} />;

  const upcomingBookings = future
    ? bookings
      .filter((booking) => parseISO(booking.date) > new Date())
      .map(useBookingComplete)
    : [],
    recentBookings = future
      ? bookings
        .filter((booking) => parseISO(booking.date) <= new Date())
        .map(useBookingComplete)
      : bookings.map(useBookingComplete);

  const handleWheel = (e: React.WheelEvent<HTMLElement>) =>
    (e.currentTarget.scrollLeft += e.deltaY);

  return (
    <div className="size-full flex flex-col overflow-auto justify-center">
      <div className="font-heading m-8 text-xl flex justify-between items-center">
        <span>
          {future ? "Upcoming and recent bookings " : "Bookings "}
          <FilterText
            filter="year-booking"
            data={filters.year ?? today.getFullYear()}
          />
          <FilterText filter="locationId" data={filters.locationId} />
          <FilterText filter="formatId" data={filters.formatId} />
        </span>

        <span className="font-heading text-5xl font-extrabold relative group">
          Cinetix
          <span className="text-accent ml-0.5">.</span>
          <div className="absolute w-full h-1.25 -bottom-2 bg-accent rounded-full duration-300 group-hover:w-0 animate-grow" />
        </span>
      </div>

      <div
        className="size-full overflow-x-scroll overflow-y-hidden flex gap-8"
        onWheel={handleWheel}
        ref={list}
      >
        {upcomingBookings.length > 0 && (
          <div className="w-fit h-full flex pb-20 p-10 gap-15">
            {upcomingBookings.map((booking) => (
              <BookingCard booking={booking} key={booking.id} ringGlow />
            ))}
          </div>
        )}

        <div className="w-fit h-full flex pb-20 p-10 gap-15">
          {recentBookings.map((booking) => (
            <BookingCard booking={booking} key={booking.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
