import { useState, type ChangeEvent, type Ref } from "react";
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
import { CircleXIcon } from "lucide-react";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: Set<string>) => void;
  onBlur: () => void;
  value?: Set<string>;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

// allows upto 3 upper or lowercase letters, followed by optional '-', and upto 3 digits per seat
const seatPattern = /^[A-Za-z]{1,3}-?[0-9]{1,3}$/;
const maxSeats = 20; // allow max 20 seats

export default function SeatsInput({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [invalid, setInvalid] = useState(false);
  const full = value ? value.size >= maxSeats : false;

  const seatsArr = value ? Array.from(value.values()) : [];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (invalid) setInvalid(false);
    setInput(e.target.value.trim());
  }

  function addSeat() {
    const seat = input?.trim().toUpperCase();
    if (!seat || !seatPattern.test(seat)) return setInvalid(true);

    const newSeats = new Set([...seatsArr, seat.replace("-", "")]);
    onChange(newSeats);
    setInput("");
  }

  function removeSeat(seat: string) {
    const newSeats = new Set(seatsArr.filter((s) => s !== seat));
    onChange(newSeats);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault(); // dont submit
    addSeat();
  }

  return (
    <>
      <Field data-invalid={fieldState.invalid}>
        <FieldContent>
          <FieldLabel htmlFor="seat-input">Seats</FieldLabel>
        </FieldContent>

        <ButtonGroup>
          <Input
            id="seat-input"
            type="text"
            className="bg-muted not-placeholder-shown:uppercase"
            placeholder="Add seat (A1, BBB2)"
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled || full}
            name={name}
            value={input}
            ref={ref}
            maxLength={7}
            aria-invalid={fieldState.invalid || invalid}
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />

          <Button
            variant="outline"
            type="button"
            onClick={addSeat}
            disabled={disabled || full}
          >
            Add
          </Button>
        </ButtonGroup>

        {fieldState.error && <FieldError errors={[fieldState.error]} />}
        {invalid ? (
          <FieldError>Invalid seat format. Use: A1 or AA-11</FieldError>
        ) : (
          <FieldDescription className="text-xs">Max 20 seats.</FieldDescription>
        )}
      </Field>

      {seatsArr.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {seatsArr.map((seat) => (
            <Badge key={seat} variant="outline" className="h-fit">
              {seat}
              <Button
                type="button"
                variant="ghost"
                className="hover:text-destructive p-0"
                aria-description={`Remove seat ${seat}.`}
                onClick={() => removeSeat(seat)}
              >
                <CircleXIcon />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
