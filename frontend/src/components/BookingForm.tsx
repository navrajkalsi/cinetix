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
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
import FormatSelect from "./FormatSelect";

// complete booking schema with full movie, location and format types
const schema = z.object({
  movie: z.object({
    name: z.string(),
    external_id: z.number(),
    poster_path: z.string().nullable(),
    release_date: z.string().nullable(),
  }),

  location: z.object({
    name: z.string(),
    address: z.string(),
    external_id: z.string(),
  }),

  format: z.object({ id: z.number(), name: z.string() }),

  dateTime: z.date(),

  // price: z.number().nullable(),
  //
  // seats: z.array(z.string()),
});

// ts type constructed by zod after validation
type infered = z.infer<typeof schema>;

export default function BookingForm() {
  const { register, handleSubmit, formState, control } = useForm<infered>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: infered) {
    console.log(data);
  }

  return (
    <Card className="mx-auto w-full max-w-xs shadow-black z-10">
      <CardHeader>
        <CardTitle>Create a new Booking</CardTitle>
        <CardDescription>
          with saved or new movies and locations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="booking-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 h-fit"
        >
          <Controller
            name="movie"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="movie-combobox">Movie</FieldLabel>
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>

                <MovieCombobox
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  disabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                  invalid={fieldState.invalid}
                  id="movie-combobox"
                />
              </Field>
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="location-combobox">Location</FieldLabel>
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>

                <LocationCombobox
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  disabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                  invalid={fieldState.invalid}
                  id="location-combobox"
                />
              </Field>
            )}
          />

          <Controller
            name="format"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="format-select">Format</FieldLabel>
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>

                <FormatSelect
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  disabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                  invalid={fieldState.invalid}
                  id="format-combobox"
                />
              </Field>
            )}
          />
        </form>
      </CardContent>

      <CardFooter className="flex justify-center items-center">
        <Button type="submit" form="booking-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
