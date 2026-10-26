import type { BookingComplete } from "@/models/Booking";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Item, ItemDescription, ItemTitle } from "./ui/item";
import { Link2Icon } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import { cn } from "cn";

interface Props {
  booking: BookingComplete;
  // should the card content be visible
  // on true, card content is always visible
  // on false, card content is never visible
  // on undefined, card content is visible on hover only
  contentVisible?: boolean;
  // scale up on hover
  hoverScale?: boolean;
}

function getItem(title: string, description: string, link?: string) {
  return (
    <Item className="flex flex-row justify-between font-heading">
      <ItemDescription className="font-semibold text-base">
        {description}
      </ItemDescription>
      <ItemTitle className="text-base">
        {link ? (
          <Link
            to={link}
            className="link flex flex-row items-center gap-2 text-base/relaxed"
          >
            {title} <Link2Icon className="size-4" />
          </Link>
        ) : (
          <>{title}</>
        )}
      </ItemTitle>
    </Item>
  );
}

export default function BookingCard({
  booking,
  contentVisible,
  hoverScale = true,
}: Props) {
  const bg = `https://image.tmdb.org/t/p/w780${booking.movie.poster_path}`;

  return (
    <Card
      className={cn(
        "group h-full min-w-96 aspect-2/3 bg-cover bg-center max-w-full rounded-10xl justify-end p-0 duration-500",
        hoverScale && "hover:scale-105",
      )}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {contentVisible !== false && (
        <CardContent
          className={cn(
            "bg-background/55 w-full rounded-10xl backdrop-blur-sm py-5 z-10 duration-300",
            contentVisible !== true && "translate-y-full",
            contentVisible === undefined && "group-hover:translate-y-0",
          )}
        >
          {getItem(booking.movie.name, "Movie", `/movies/${booking.movie_id}`)}
          {getItem(
            booking.location.name,
            "Location",
            `/locations/${booking.location_id}`,
          )}
          {getItem(
            booking.format.name,
            "Format",
            `/formats/${booking.format_id}`,
          )}
          {getItem(format(parseISO(booking.date), "E MMM d, y"), "Date")}
          {booking.time &&
            getItem(
              format(parse(booking.time, "HH:mm:ss", new Date()), "h:mm a"),
              "Time",
            )}
          {booking.price && getItem(`$${booking.price}`, "Price")}
          {booking.external_id && getItem(booking.external_id, "Booking ID")}
          {booking.seats.length > 0 &&
            getItem(booking.seats.join(", "), "Seats")}
        </CardContent>
      )}
    </Card>
  );
}
