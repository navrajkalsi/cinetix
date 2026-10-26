import { type Ref } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: number) => void;
  onBlur: () => void;
  value?: number;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

export default function PriceInput({
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
      <FieldLabel htmlFor="price-input">Price</FieldLabel>

      <InputGroup>
        <InputGroupInput
          id="price-input"
          type="number"
          className="bg-muted"
          placeholder="--.--"
          step="0.01"
          min={0.01}
          onChange={(e) =>
            onChange(
              Number.isNaN(e.target.valueAsNumber)
                ? undefined
                : e.target.valueAsNumber,
            )
          }
          onBlur={onBlur}
          disabled={disabled}
          name={name}
          value={value ?? ""}
          ref={ref}
          aria-invalid={fieldState.invalid}
        />
        <InputGroupAddon align="inline-start">
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
