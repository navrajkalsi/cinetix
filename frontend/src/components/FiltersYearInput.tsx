import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface Props {
  value: number | null;
  onValueChange: (v: number | null) => void;
}

const minYear = 2000;
const maxYear = new Date().getFullYear() + 1;

export default function FiltersYearInput({ value, onValueChange }: Props) {
  const [inputValue, setInputValue] = useState(value);
  const input = useRef<HTMLInputElement | null>(null);
  const dirty = inputValue !== value;

  const updateValue = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(
      Number.isNaN(e.target.valueAsNumber) ||
        !Number.isInteger(e.target.valueAsNumber)
        ? null
        : e.target.valueAsNumber,
    );

  const handleClick = (newValue: number | null) => {
    const inputTarget = input.current;

    if (!inputTarget) return; // skip
    if (newValue && !inputTarget.reportValidity()) return; // invalid

    onValueChange(newValue);
  };

  useEffect(() => setInputValue(value), [value]);

  return (
    <InputGroup>
      <InputGroupInput
        type="number"
        placeholder="Year"
        value={inputValue ?? ""}
        min={minYear}
        max={maxYear}
        onChange={updateValue}
        className="no-stepper"
        ref={input}
      />

      <InputGroupAddon align="inline-end">
        {dirty && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleClick(inputValue)}
          >
            <CheckIcon />
          </Button>
        )}

        {!dirty && value && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleClick(null)}
          >
            <XIcon />
          </Button>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
