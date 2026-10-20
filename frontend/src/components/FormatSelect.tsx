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
  // error during validation
  invalid: boolean;
  // input id for label
  id?: string;
}

export default function FormatSelect({
  onChange,
  onBlur,
  disabled,
  name,
  ref,
  value,
  invalid,
  id,
}: Props) {
  const [, , formats] = useLookupArrays();

  formats.sort((a, b) => (a.name < b.name ? -1 : 1));

  return (
    <Select
      id={id}
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
        aria-invalid={invalid}
      >
        <SelectValue placeholder="Select a format" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={true}>
        <SelectGroup>
          {formats.map((format) => (
            <SelectItem key={format.id} value={format}>
              {format.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
