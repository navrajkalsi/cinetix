import { type Ref } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import type { ControllerFieldState } from "react-hook-form";
import { cn } from "cn";

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

export default function TimeInput({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  return (
    <Field className="w-32" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="time-input">Time</FieldLabel>

      <Input
        type="time"
        disabled={disabled}
        id="time-input"
        step="60"
        className={cn(
          "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ",
          !value && "text-muted-foreground",
        )}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        value={value ?? ""}
        name={name}
        ref={ref}
      />
    </Field>
  );
}
