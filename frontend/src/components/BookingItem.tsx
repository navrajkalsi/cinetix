import useBookingComplete from "@/hooks/useBookingCompelete";
import type { Booking } from "@/models/Booking";
import { Link } from "react-router";
import {
  ArmchairIcon,
  CalendarDaysIcon,
  Clock2Icon,
  FilmIcon,
  IdCardIcon,
  MapPinIcon,
  ReceiptIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { parseDate, parseTime } from "@/utils";
import { Fragment } from "react/jsx-runtime";
import type { Entity } from "@/layouts/DetailsLayout";

interface Props {
  booking: Booking;
  // what page are the bookings being shown for
  primary: Entity["type"];
  // further fields to hide, in addition to primary
  secondary: Entity["type"][];
}

export default function BookingItem({ booking, primary, secondary }: Props) {
  const complete = useBookingComplete(booking);
  const movie = complete.movie;
  const location = complete.location;
  const format = complete.format;

  // blank labels to render at end to maintain consistent height of the item
  let blanks = 0;

  const incrementBlanks = () => {
    blanks++;
    return <></>;
  };

  return (
    <div className="bg-background/80 rounded-5xl flex gap-4 p-4 h-fit m-1 max-w-full">
      {primary !== "movie" && (
        <div
          className="aspect-2/3 rounded-xl max-h-full h-full w-auto bg-center bg-cover"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w154${movie.poster_path})`,
          }}
          aria-hidden
        />
      )}

      <div className="flex flex-col gap-5 p-2.5 w-full min-w-0 h-fit max-w-full">
        <div className="text-xl flex items-center min-w-0 w-full overflow-hidden gap-2.5">
          {primary !== "movie" &&
            !secondary.includes("movie") &&
            linkIcon(movie.name, `/movies/${movie.id}`, VideoIcon)}
          {primary !== "location" &&
            !secondary.includes("location") &&
            linkIcon(location.name, `/locations/${location.id}`, MapPinIcon)}
          {primary !== "format" &&
            !secondary.includes("format") &&
            linkIcon(format.name, `/formats/${format.id}`, FilmIcon)}
        </div>

        <div className="grid grid-cols-2 gap-3 text-muted-foreground">
          {labelIcon(parseDate(booking.date), CalendarDaysIcon)}

          {booking.time
            ? labelIcon(parseTime(booking.time), Clock2Icon)
            : incrementBlanks()}

          {booking.seats.length > 0
            ? labelIcon(booking.seats.join(", "), ArmchairIcon)
            : incrementBlanks()}

          {booking.price
            ? labelIcon("$" + booking.price, ReceiptIcon)
            : incrementBlanks()}

          {booking.external_id
            ? labelIcon(booking.external_id, IdCardIcon)
            : incrementBlanks()}

          {Array.from({ length: blanks }).map((_, i) => (
            <Fragment key={i}>{labelIcon()}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function linkIcon(label: string, link: string, icon: LucideIcon) {
  const Icon = icon;

  return (
    <Link
      to={link}
      className="link inline-flex items-center gap-2 min-w-0 flex-1 whitespace-nowrap overflow-hidden"
    >
      <Icon className="shrink-0" />
      <span className="truncate min-w-0">{label}</span>
    </Link>
  );
}

function labelIcon(label?: string, icon?: LucideIcon) {
  if (!label || !icon)
    return (
      <div className="invisible" aria-hidden>
        empty
      </div>
    );

  const Icon = icon;
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className="size-4 shrink-0" /> {label}
    </div>
  );
}
