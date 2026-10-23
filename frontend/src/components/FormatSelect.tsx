import useLookupArrays from "@/hooks/useLookupArrays";
import type { Format } from "@/models/Format";
import { useCallback, type Ref } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldContent, FieldError, FieldLabel } from "./ui/field";
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
  const [, , formats] = useLookupArrays();

  const sort = useCallback(
    () => formats.sort((a, b) => (a.name < b.name ? -1 : 1)),
    [formats],
  );

  sort();

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor="format-select">
          Format<span className="text-destructive">*</span>
        </FieldLabel>
        <FieldError errors={[fieldState.error]} />
      </FieldContent>

      <Select
        id="format-select"
        itemToStringLabel={(f: Format) => f.name}
        itemToStringValue={(f: Format) => f.id.toString()}
        isItemEqualToValue={(i, v) => i.id === v.id}
        name={name}
        onValueChange={(v) => onChange(v ?? undefined)} // rhf
        disabled={disabled} // from rhf
        inputRef={ref}
        highlightItemOnHover
      >
        <SelectTrigger
          onBlur={onBlur} // rhf
          value={value?.name}
          aria-invalid={fieldState.invalid}
        >
          <SelectValue placeholder="Select a format" />
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
    </Field>
  );
}
