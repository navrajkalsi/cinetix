import BookingForm from "@/components/BookingForm";
import PosterHall from "@/components/PosterHall";

export default function BookingNew() {
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <PosterHall />
      <BookingForm />
    </div>
  );
}
