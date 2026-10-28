import { postBooking } from "@/api/bookings";
import BookingCard from "@/components/BookingCard";
import BookingForm from "@/components/BookingForm";
import BookingShimmer from "@/components/BookingShimmer";
import PosterHall from "@/components/PosterHall";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Booking, BookingComplete, BookingCreate } from "@/models/Booking";
import { showErrorToast } from "@/utils";
import { CheckIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// possible states of new booking page
type State =
  | { status: "filling" } // user is filling the form
  | { status: "confirming"; data: BookingComplete } // asking user for confirmation, after pressing submit
  | { status: "submitting"; data: BookingCreate } // user confirmed, making post request
  | { status: "success"; data: Booking } // api success
  | { status: "error"; data: string }; // error during post request

export default function BookingNew() {
  const [activeState, setState] = useState<State>({ status: "filling" });
  const navigate = useNavigate();

  function handleConfirm(complete: BookingComplete) {
    if (activeState.status === "confirming") return; // recalled
    setState({ status: "confirming", data: complete });
  }

  async function handleSubmit(create: BookingCreate) {
    if (activeState.status === "submitting") return; // recalled
    setState({ status: "submitting", data: create });

    // work on this
    try {
      const booking = (await postBooking(create)) as Booking;
      navigate(`/bookings/${booking.id}`);
    } catch {
      setState({ status: "filling" });
      return showErrorToast(
        "Failed to register the booking. Please try again.",
      );
    }
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <PosterHall />
      <BookingForm
        onConfirm={handleConfirm}
        disable={activeState.status !== "filling"}
      />

      {activeState.status === "confirming" && (
        <Dialog
          defaultOpen
          onOpenChange={(open) => {
            if (!open) setState({ status: "filling" }); // prevent submitting loop
          }}
        >
          <DialogContent
            className="z-50 h-max max-h-full rounded-10xl w-max flex flex-col items-center"
            showCloseButton={false}
          >
            <DialogHeader className="flex flex-col items-center gap-5">
              <DialogTitle className="text-xl text-center">
                Looking Good?
              </DialogTitle>

              <BookingCard
                booking={activeState.data}
                contentVisible={true}
                hoverScale={false}
              />
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center sm:justify-evenly justify-evenly w-full">
              <Button
                size="lg"
                aria-label="Confirm submission."
                onClick={() => handleSubmit(activeState.data)}
              >
                Yes
                <CheckIcon data-icon="inline-end" aria-label="Submit." />
              </Button>
              <Button
                size="lg"
                aria-label="Cancel submission."
                onClick={() => setState({ status: "filling" })}
              >
                No
                <PenIcon data-icon="inline-end" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {activeState.status === "submitting" && <BookingShimmer />}
    </div>
  );
}
