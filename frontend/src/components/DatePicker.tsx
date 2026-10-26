import { useState, type Ref } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Field, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";
import { cn } from "cn";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: Date) => void;
  onBlur: () => void;
  value?: Date;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLButtonElement>;
  fieldState: ControllerFieldState;
}

export default function DatePicker({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="date-picker">
        Date<span className="text-destructive">*</span>
      </FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          name={name}

          render={
            <Button
              variant="secondary"
              id="date-picker"
              className={cn(
                "w-32 justify-between font-normal",
                value ? "" : "text-muted-foreground",
              )}
              disabled={disabled}
              ref={ref}
              aria-invalid={fieldState.invalid}
            >
              {
                value ? format(value, "LLL d, y") : "Jul 17, 2026"
                // pattern doc: https://date-fns.org/v4.4.0/docs/format
              }
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          }
        />

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            defaultMonth={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            onDayBlur={onBlur}
          />
        </PopoverContent>
      </Popover>

      <FieldError errors={[fieldState.error]} />
    </Field>
  );
}
