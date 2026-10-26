import LocationCombobox from "./LocationCombobox";
import MovieCombobox from "./MovieCombobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import FormatSelect from "./FormatSelect";
import PriceInput from "./PriceInput";
import SeatInput from "./SeatInput";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import DatePicker from "./DatePicker";
import TimeInput from "./TimeInput";
import { postMovie } from "@/api/movies";
import type { MovieCreate } from "@/models/Movie";
import type { LocationCreate } from "@/models/Location";
import { postLocation } from "@/api/locations";
import { postBooking } from "@/api/bookings";
import BookingIdInput from "./BookingIdInput";
import { useEffect, useState } from "react";

// allows upto 3 upper or lowercase letters, followed by optional '-', and upto 3 digits per seat
const seatPattern = /^[A-Za-z]{1,3}-?[0-9]{1,3}$/;
const maxSeats = 20; // allow max 20 seats

// complete booking schema with full movie, location and format types
const schema = z.object({
  movie: z.object(
    {
      name: z.string(),
      external_id: z.number(),
      poster_path: z.string().nullable(),
      release_date: z.string().nullable(),
    },
    "Please select a movie.",
  ),

  location: z.object(
    {
      name: z.string(),
      address: z.string(),
      external_id: z.string(),
    },
    "Please select a location.",
  ),

  format: z.object(
    { id: z.number(), name: z.string() },
    "Please select a format.",
  ),

  date: z.date("Please select a date."),

  time: z.iso.time("Invalid time.").optional(),

  price: z
    .number("Please enter a valid price.")
    .min(0.01, "Please enter a positive price or remove it.")
    .max(500, "Don't be crazy now!")
    .optional(),

  id: z
    .string("Please enter a valid Booking ID.")
    .min(5, "Booking ID must be 5 characters long.")
    .max(10, "Booking ID must be less than 10 characters.")
    .optional(),

  seats: z
    .array(
      z
        .string("Please enter a valid seat.")
        .trim()
        .toUpperCase()
        .regex(seatPattern, "Seat must be in format: A1 or A-1")
        .transform((s) => s.replace("-", "")),
    )
    .max(maxSeats, `Only ${maxSeats} seats are allowed per booking.`)
    .superRefine((seats, ctx) => {
      const seen = new Set<string>();
      seats.forEach((s, i) => {
        if (seen.has(s))
          ctx.addIssue({
            code: "custom",
            message: "Duplicate seat",
            path: [i], // makes the error reach controller with name: seats.i
          });
        seen.add(s);
      });
    })
    .optional(),
});

// ts type constructed by zod after validation
type infered = z.infer<typeof schema>;

export default function BookingForm() {
  const [focusLast, setFocusLast] = useState(false); // state to determine when to focus on last seat input

  const form = useForm<infered>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "seats",
  });

  async function onSubmit(data: infered) {
    console.log(data);
    console.log(data.date.toISOString());

    // check lookup arrays for movie and location first

    const movie: MovieCreate = data.movie;
    const location: LocationCreate = data.location;
    const dateString = data.date.toISOString().split("T", 1)[0];

    try {
      const movieId = (await postMovie(movie)).id;
      const locationId = (await postLocation(location)).id;

      const booking = await postBooking({
        external_id: data.id ?? null,
        date_time: data.time
          ? new Date(`${dateString}T${data.time}:00.000Z`)
          : new Date(dateString),
        seats: data.seats ?? [],
        price: data.price ?? null,
        movie_id: movieId,
        location_id: locationId,
        format_id: data.format.id,
        source: "manual",
      });

      console.log(booking);
    } catch (e) {
      console.error(e);
    }
  }

  // appends empty seat only if all the seats present pass validation
  async function handleSeatAdd() {
    const valid = await form.trigger("seats");
    if (!valid) return;

    append(undefined);
    setFocusLast(true);
  }

  useEffect(() => {
    if (!focusLast) return;

    form.setFocus(`seats.${fields.length - 1}`);
    setFocusLast(false);
  }, [focusLast, fields.length, form]);

  return (
    <Card className="mx-auto w-full max-w-xs max-h-3/4 overflow-y-auto shadow-black z-10">
      <CardHeader>
        <CardTitle>Create a new Booking</CardTitle>
        <CardDescription>
          with saved or new movies and locations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="booking-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5 h-fit"
        >
          <Controller
            name="movie"
            control={form.control}
            render={({ field, fieldState }) => (
              <MovieCombobox {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <LocationCombobox {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="format"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormatSelect {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <DatePicker {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="time"
            control={form.control}
            render={({ field, fieldState }) => (
              <TimeInput {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <PriceInput {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="id"
            control={form.control}
            render={({ field, fieldState }) => (
              <BookingIdInput {...field} fieldState={fieldState} />
            )}
          />

          <FieldSet className="col-span-full">
            <FieldLegend variant="label">Seats</FieldLegend>
            <FieldDescription className="text-xs">
              Add upto {maxSeats} seats.
            </FieldDescription>

            {fields.length > 0 && (
              <FieldGroup className="grid gap-2.5 grid-cols-2">
                {fields.map((field, index) => (
                  <Controller
                    key={field.id} // must use field.id
                    name={`seats.${index}`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SeatInput
                        {...field}
                        onChange={async (v) => {
                          field.onChange(v);
                          await form.trigger("seats"); // validate array for duplicates
                        }}
                        fieldState={fieldState}
                        index={index}
                        remove={remove}
                      />
                    )}
                  />
                ))}
              </FieldGroup>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSeatAdd()}
              disabled={fields.length >= maxSeats}
            >
              Add Seat
            </Button>

            {form.formState.errors.seats?.root && (
              <FieldError errors={[form.formState.errors.seats.root]} />
            )}
          </FieldSet>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center items-center">
        <Button
          type="submit"
          form="booking-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting" : "Submit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
