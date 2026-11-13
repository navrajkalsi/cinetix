import { useLoaderData } from "react-router";
import { parseISO } from "date-fns";
import BookingCard from "@/components/BookingCard";
import useBookingComplete from "@/hooks/useBookingCompelete";
import type { LoaderData } from "@/loaders";

export type BookingsData = Extract<LoaderData, { path: "bookings" }>;
const today = new Date();

export default function Bookings() {
  // bookings fetched during routing
  const { bookings, filters, future }: BookingsData = useLoaderData();

  if (!bookings.length) return empty(filters);

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
      <div className="font-heading mx-12 mt-12 text-2xl">
        {upcomingBookings.length
          ? "Upcoming and recent bookings for year "
          : "Bookings for year "}
        <span className="font-bold">{filters.year ?? today.getFullYear()}</span>
        :
      </div>

      <div
        className="size-full overflow-x-scroll overflow-y-hidden flex"
        onWheel={handleWheel}
      >
        {upcomingBookings.length > 0 && (
          <div className="w-fit h-full flex pb-24 p-12 gap-15">
            {upcomingBookings.map((booking) => (
              <BookingCard booking={booking} key={booking.id} ringGlow />
            ))}
          </div>
        )}

        <div className="w-fit h-full flex pb-24 p-12 gap-15">
          {recentBookings.map((booking) => (
            <BookingCard booking={booking} key={booking.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

const empty = (filters: BookingsData["filters"]) => (
  <div className="size-full flex justify-center items-center text-5xl font-heading">
    No bookings found for year&nbsp;
    <span className="font-bold">{filters.year ?? today.getFullYear()}</span>.
  </div>
);
