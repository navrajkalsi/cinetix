import { useMemo, useState, type ChangeEvent, type Ref } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Badge } from "./ui/badge";
import { XIcon } from "lucide-react";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: Set<string>) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

// allows upto 3 upper or lowercase letters, followed by optional '-', and upto 3 digits per seat
const seatPattern = /^[A-Za-z]{1,3}-?[0-9]{1,3}$/;

export default function SeatsInput({
  onChange,
  onBlur,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [seats, setSeats] = useState<Set<string>>(new Set());
  const [invalid, setInvalid] = useState(false);

  const seatsArr = useMemo(() => Array.from(seats.values()), [seats]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();
    if (invalid) setInvalid(false);
    setInput(value);
  }

  function addSeat() {
    const seat = input?.trim().toUpperCase();
    if (!seat || !seatPattern.test(seat)) return setInvalid(true);

    const newSeats = new Set([...seatsArr, seat.replace("-", "")]);
    onChange(newSeats);
    setSeats(newSeats);
    setInput("");
  }

  function removeSeat(index: number) {
    const newSeats = new Set([
      ...seatsArr.slice(0, index++),
      ...seatsArr.slice(index),
    ]);
    onChange(newSeats);
    setSeats(newSeats);
  }

  return (
    <>
      <Field data-invalid={fieldState.invalid}>
        <FieldContent>
          <FieldLabel htmlFor="seat-input">Seats</FieldLabel>
          <ButtonGroup>
            <Input
              id="seat-input"
              type="text"
              className="bg-muted not-placeholder-shown:uppercase"
              placeholder="Add seat (A1, BBB2)"
              onChange={handleChange}
              onBlur={onBlur}
              disabled={disabled || seats.size >= 20} // max 20 seats allowed
              name={name}
              value={input}
              ref={ref}
              maxLength={7}
              aria-invalid={fieldState.invalid || invalid}
              autoComplete="off"
            />

            <Button
              variant="outline"
              type="button"
              onClick={addSeat}
              disabled={disabled || seats.size >= 20}
            >
              Add
            </Button>
          </ButtonGroup>

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
          {invalid && (
            <FieldError>Invalid seat format. Use: A1 or AA-11</FieldError>
          )}
        </FieldContent>
      </Field>

      {seatsArr.length > 0 && (
        <div>
          {seatsArr.map((seat, index) => (
            <Badge
              variant="outline"
              key={index}
              onClick={() => removeSeat(index)}
            >
              {seat} <XIcon />
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}
