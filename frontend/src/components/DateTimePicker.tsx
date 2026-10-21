import { useState, type Ref } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import type { ControllerFieldState } from "react-hook-form";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: Date) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLButtonElement>;
  fieldState: ControllerFieldState;
}

// create a customn date+time picker that keeps track of individual date and time fields and then
// combines the states to give to the form

export default function DateTimePicker({
  onChange,
  onBlur,
  disabled,
  ref,
  fieldState,
}: Props) {
  const [datetime, setDatetime] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  function handleChange(newDate?: Date, newTime?: string) {
    if (newDate && newTime)
      throw new Error("only one of date and time can be updated");

    let newDatetime;

    if (newDate) {
      if (datetime) {
        // preserve time
        newDate.setHours(datetime.getHours());
        newDate.setMinutes(datetime.getMinutes());
      } else newDate = new Date(newDate.toDateString()); // do not carry time

      newDatetime = newDate;
    } else if (newTime) {
      // hour pattern depends on locale setting
      const timePattern = /^\d{2}:\d{2}( [A|P]M)?$/;

      if (!timePattern.test(newTime))
        throw new Error("invalid time received from input");

      const meridiemPresent = newTime.length > 5; // am/pm present
      const hours = parseInt(newTime.slice(0, 2));
      const mins = parseInt(newTime.slice(3, 5));

      // preserve date
      if (!datetime) throw new Error("time is disabled until date is set");
      // convert to 24 hours if meridiem indicators are present, else assume 24 hours format
      datetime.setHours(
        meridiemPresent && newTime[6] === "P" ? hours + 12 : hours,
      );
      datetime.setMinutes(mins);

      newDatetime = datetime;
    } else throw new Error("atleast one of date and time is required");

    setDatetime(newDatetime);
    onChange(newDatetime);
  }

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker">Date</FieldLabel>
        <FieldError errors={[fieldState.error]} />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="secondary"
                id="date-picker"
                className="w-32 justify-between font-normal text-muted-foreground"
                onBlur={onBlur}
                disabled={disabled}
                ref={ref}
                aria-invalid={fieldState.invalid}
              >
                {datetime ? format(datetime, "PPP") : "Select date"}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={datetime}
              captionLayout="dropdown"
              defaultMonth={datetime}
              onSelect={(date) => {
                handleChange(date);
                setOpen(false);
              }}
              onDayBlur={onBlur}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field className="w-32">
        <FieldLabel htmlFor="time-picker">Time</FieldLabel>
        <Input
          type="time"
          disabled={!datetime} // only allow time after date
          id="time-picker"
          step="60" // hide seconds
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={(e) => handleChange(undefined, e.target.value)}
        />
      </Field>
    </FieldGroup>
  );
}
