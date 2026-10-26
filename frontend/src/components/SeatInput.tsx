import { type Ref } from "react";
import { Field, FieldError } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { XIcon } from "lucide-react";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: string) => void; // we only deal with single seat here, full set is dealt with in the form
  onBlur: () => void;
  value?: string;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
  index: number; // unique index for ids
  remove: (index: number) => void; // remove button handler from form
}

export default function SeatInput({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
  index,
  remove,
}: Props) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <InputGroup aria-orientation="horizontal">
        <InputGroupInput
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          value={value ?? ""}
          disabled={disabled}
          name={name}
          ref={ref}
          aria-invalid={fieldState.invalid}
          id={`seat.${index}`}
          placeholder="A1"
          autoComplete="off"
          spellCheck={false}
          type="text"
          className="not-placeholder-shown:uppercase"
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => remove(index)}
            aria-label={`Remove seat ${value ?? index + 1}`}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
