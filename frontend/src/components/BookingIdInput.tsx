import { type Ref } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import { Input } from "./ui/input";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: string) => void;
  onBlur: () => void;
  value?: string;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

export default function BookingIdInput({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="booking-id-input">Booking ID</FieldLabel>

      <Input
        id="booking-id-input"
        type="text"
        className="bg-muted uppercase"
        placeholder="W-----"
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onBlur={onBlur}
        disabled={disabled}
        name={name}
        value={value ?? ""}
        ref={ref}
        aria-invalid={fieldState.invalid}
        autoComplete="off"
        spellCheck={false}
      />

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
