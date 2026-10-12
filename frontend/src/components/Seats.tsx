// Manages a collection of seats and lets the user add and remove them with pills.

import { useEffect, useState } from "react";
import "./Seats.css";
import Input from "./Input";
import Pill from "./Pill";

interface PillsProps {
  sendSeats: (seats: Set<string>) => void; // for sharing to the parent
}

export default function Seats({ sendSeats }: PillsProps) {
  const [nextSeat, setNextSeat] = useState(""); // next seat to add from input
  const [seats, setSeats] = useState<Set<string>>(new Set()); // current collection of unique seats
  const [invalid, setInvalid] = useState(false); // is the input seat invalid

  const seatsArr = Array.from(seats.values());
  // allows upto 3 upper or lowercase letters, followed by optional '-', and upto 3 digits
  const seatRegex = /^[A-Za-z]{1,3}-?[0-9]{1,3}$/;

  function updateNextSeat(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNextSeat(value); // value in the input
    e.preventDefault();

    if (seatRegex.test(value)) setInvalid(false); // may be set invalid while adding
  }

  function addNextSeat() {
    // adds seat from the input to collection, if valid
    if (invalid) return;

    if (nextSeat.length === 0) return setInvalid(true);

    if (!seatRegex.test(nextSeat)) return setInvalid(true); // will be set to false on typing

    setSeats((prev) =>
      new Set(prev).add(nextSeat.toUpperCase().replace("-", "")),
    ); // set ensures no duplication
    // also removes - from the seat
    setNextSeat("");
  }

  function handleRemove(s: string) {
    setSeats((prev) => {
      const newSet = new Set(prev);
      newSet.delete(s);
      return newSet;
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addNextSeat();
    }
  }

  useEffect(() => {
    sendSeats(seats); // send updated set to the parent
  }, [sendSeats, seats]);

  return (
    <div className="seats">
      <div className="seat-next">
        <Input
          placeholder="Add Seat"
          value={nextSeat}
          onChange={updateNextSeat}
          onKeyDown={handleKeyDown}
          className={invalid ? "invalid" : ""}
        />
        <button type="button" className="seat-add" onClick={addNextSeat}>
          ✓
        </button>
      </div>

      <div className="helper-text">Seats format: 'A1' 'BBB11'</div>

      {seatsArr.length > 0 && (
        <div className="seat-collection">
          {seatsArr.map((e) => (
            <Pill key={e} content={e} handleDiscard={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
