import useBookingComplete from "@/hooks/useBookingCompelete";
import type { Booking } from "@/models/Booking";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import type { Key } from "react";
import type { EntityType } from "@/layouts/Details";
import { Link } from "react-router";
import {
  ArmchairIcon,
  CalendarDaysIcon,
  Clock2Icon,
  DotIcon,
  FilmIcon,
  IdCardIcon,
  MapPinIcon,
  ReceiptIcon,
  VideoIcon,
} from "lucide-react";
import { parseDate, parseTime } from "@/utils";

interface Props {
  booking: Booking;
  hideField: EntityType;
}

export default function BookingItem({ booking, hideField }: Props) {
  const complete = useBookingComplete(booking);
  const movie = complete.movie;
  const location = complete.location;
  const format = complete.format;

  return (
    <div className="bg-background/80 rounded-5xl flex gap-5 p-5 h-min">
      {hideField !== "movie" && (
        <div className="aspect-2/3 h-full w-auto max-h-full flex items-center">
          <img
            src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
            className="aspect-2/3 w-full h-auto object-cover block rounded-xl"
          />
        </div>
      )}

      <div className="flex flex-col gap-5 p-2.5 w-full h-fit">
        <div className="text-xl flex items-center">
          {hideField === "movie" && (
            <>
              <Link
                to={`/locations/${location.id}`}
                className="link inline-flex items-center gap-2"
              >
                <MapPinIcon /> {location.name}
              </Link>
              <DotIcon />
              <Link
                to={`/formats/${format.id}`}
                className="link inline-flex items-center gap-2"
              >
                <FilmIcon /> {format.name}
              </Link>
            </>
          )}

          {hideField === "location" && (
            <>
              <Link
                to={`/movies/${movie.id}`}
                className="link inline-flex items-center gap-2"
              >
                <VideoIcon /> {movie.name}
              </Link>
              <DotIcon />
              <Link
                to={`/formats/${format.id}`}
                className="link inline-flex items-center gap-2"
              >
                <FilmIcon /> {format.name}
              </Link>
            </>
          )}

          {hideField === "format" && (
            <>
              <Link
                to={`/movies/${movie.id}`}
                className="link inline-flex items-center gap-2"
              >
                <VideoIcon /> {movie.name}
              </Link>
              <DotIcon />
              <Link
                to={`/locations/${location.id}`}
                className="link inline-flex items-center gap-2"
              >
                <MapPinIcon /> {location.name}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <CalendarDaysIcon className="size-4" />
            {parseDate(booking.date)}
          </div>
          {booking.time && (
            <div className="inline-flex items-center gap-2">
              <Clock2Icon className="size-4" />
              {parseTime(booking.time)}
            </div>
          )}
          {booking.seats.length > 0 && (
            <div className="inline-flex items-center gap-2">
              <ArmchairIcon className="size-4" /> {booking.seats.join(", ")}
            </div>
          )}
          {booking.price && (
            <div className="inline-flex items-center gap-2">
              <ReceiptIcon className="size-4" /> ${booking.price}
            </div>
          )}
          {booking.external_id && (
            <div className="inline-flex items-center gap-2">
              <IdCardIcon className="size-4" /> {booking.external_id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
