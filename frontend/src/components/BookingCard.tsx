import type { BookingComplete } from "@/models/Booking";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Item, ItemDescription, ItemTitle } from "./ui/item";
import {
  CloudCogIcon,
  Link2Icon,
  UserPenIcon,
  UserPlusIcon,
} from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import { cn } from "cn";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { parseDate, parseTime } from "@/utils";

interface Props {
  booking: BookingComplete;
  // should the card content be visible
  // on true, card content is always visible
  // on false, card content is never visible
  // on undefined, card content is visible on hover only
  contentVisible?: boolean;
  // scale up on hover
  hoverScale?: boolean;
  className?: string;
}

function getItem(title: string, description: string, link?: string) {
  return (
    <Item className="flex flex-row justify-between font-heading items-center gap-2.5">
      <ItemDescription className="font-semibold text-base w-fit shrink-0">
        {description}
      </ItemDescription>
      <ItemTitle className="text-base flex-1 text-right min-w-0 justify-end">
        {link ? (
          <Link
            to={link}
            className="link inline-flex items-center justify-end flex-wrap gap-2 text-base/relaxed"
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
  className,
}: Props) {
  const bg = `https://image.tmdb.org/t/p/w780${booking.movie.poster_path}`;

  return (
    <Card
      className={cn(
        "group h-full min-w-96 aspect-2/3 bg-cover bg-center max-w-full rounded-10xl justify-end p-0 duration-500",
        hoverScale && "hover:scale-105",
        className,
      )}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {contentVisible !== false && (
        <CardContent
          className={cn(
            "bg-background/55 w-full rounded-10xl backdrop-blur-sm py-5 z-10 duration-300 flex flex-col",
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
          {getItem(parseDate(booking.date), "Date")}
          {booking.time && getItem(parseTime(booking.time), "Time")}
          {booking.price && getItem(`$${booking.price}`, "Price")}
          {booking.external_id && getItem(booking.external_id, "Booking ID")}
          {booking.seats.length > 0 &&
            getItem(booking.seats.join(", "), "Seats")}

          <Tooltip>
            <TooltipTrigger
              render={
                <Badge variant="outline" className="self-center">
                  {booking.source === "auto" && (
                    <>
                      <CloudCogIcon data-icon="inline-start" /> Auto generated
                    </>
                  )}
                  {booking.source === "manual" && (
                    <>
                      <UserPlusIcon data-icon="inline-start" /> User created
                    </>
                  )}
                  {booking.source === "auto_edit" && (
                    <>
                      <UserPenIcon data-icon="inline-start" /> Auto generated,
                      with user edits
                    </>
                  )}
                </Badge>
              }
            />

            <TooltipContent side="bottom" className="text-center">
              {booking.source === "auto" &&
                "This booking was generated automatically from email."}
              {booking.source === "manual" &&
                "This booking was created manually by the user."}
              {booking.source === "auto_edit" &&
                "Originally this booking was generated automatically, but the user has made some edits."}
            </TooltipContent>
          </Tooltip>
        </CardContent>
      )}
    </Card>
  );
}
