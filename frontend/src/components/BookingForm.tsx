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
import FormatSelect from "./FormatSelect";
import DateTimePicker from "./DateTimePicker";
import PriceInput from "./PriceInput";

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

  datetime: z.date(),

  price: z.number().nullable(),

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
              <MovieCombobox {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <LocationCombobox {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="format"
            control={control}
            render={({ field, fieldState }) => (
              <FormatSelect {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="datetime"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker {...field} fieldState={fieldState} />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <PriceInput {...field} fieldState={fieldState} />
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
