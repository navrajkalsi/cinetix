import BookingCard from "@/components/BookingCard";
import useBookingComplete from "@/hooks/useBookingCompelete";
import type { Booking } from "@/models/Booking";
import { useLoaderData } from "react-router";

export default function Booking() {
  const { booking }: { booking: Booking } = useLoaderData();
  const complete = useBookingComplete(booking);

  return (
    <div className="w-full h-full flex justify-center items-center p-32">
      <BookingCard booking={complete} contentVisible={false} />
    </div>
  );
}
