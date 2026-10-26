import useLookupArrays from "@/hooks/useLookupArrays";
import type { Format } from "@/models/Format";
import { type Ref } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  // this component does not use the FormatCreate model as no creation is possible therefore we can
  // directly use the id, instead of wasting a request server.
  onChange: (value?: Format) => void;
  onBlur: () => void;
  // current selected, if any
  value?: Format;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

export default function FormatSelect({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  const [, , formats] = useLookupArrays(true);

  return (
    <Field data-invalid={fieldState.invalid} className="col-span-full">
      <FieldLabel htmlFor="format-select">
        Format<span className="text-destructive">*</span>
      </FieldLabel>

      <Select
        id="format-select"
        itemToStringLabel={(f: Format) => f.name}
        itemToStringValue={(f: Format) => f.id.toString()}
        isItemEqualToValue={(i, v) => i.id === v.id}
        onValueChange={(v) => onChange(v ?? undefined)} // rhf
        disabled={disabled} // from rhf
        inputRef={ref}
        highlightItemOnHover
        name={name}
        value={value ?? null}
      >
        <SelectTrigger
          onBlur={onBlur} // rhf
          aria-invalid={fieldState.invalid}
        >
          <SelectValue placeholder="IMAX" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {formats.map((format) => (
              <SelectItem key={format.id} value={format}>
                {format.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
