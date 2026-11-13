import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import { CircleCheckIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface Props {
  value?: number;
  onValueChange: (v: number | undefined) => void;
}

export default function FiltersYearInput({ value, onValueChange }: Props) {
  const [inputValue, setInputValue] = useState(value);
  const dirty = inputValue !== value;

  const updateValue = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(
      Number.isNaN(e.target.valueAsNumber) ||
        !Number.isInteger(e.target.valueAsNumber)
        ? undefined
        : e.target.valueAsNumber,
    );

  useEffect(() => setInputValue(value), [value]);

  return (
    <InputGroup>
      <InputGroupInput
        type="number"
        placeholder="Year"
        value={inputValue ?? ""}
        onChange={updateValue}
        className="no-stepper"
      />

      {dirty && (
        <InputGroupAddon align="inline-end">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onValueChange(inputValue)}
          >
            <CircleCheckIcon />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
