import { type Ref } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import { Input } from "./ui/input";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: number) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

export default function PriceInput({
  onChange,
  onBlur,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor="price-input">Format</FieldLabel>
        <FieldError errors={[fieldState.error]} />
      </FieldContent>

      <Input
        id="price-input"
        type="number"
        placeholder="Enter price"
        step="0.01"
        min={0.01}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        onBlur={onBlur}
        disabled={disabled}
        name={name}
        ref={ref}
        aria-invalid={fieldState.invalid}
      />
    </Field>
  );
}
