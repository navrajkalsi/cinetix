import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import useBookingComplete from "@/hooks/useBookingCompelete";
import type { Booking } from "@/models/Booking";
import { parseDate, parseTime } from "@/utils";
import {
  ArmchairIcon,
  CalendarDaysIcon,
  Clock2Icon,
  IdCardIcon,
  Link2Icon,
  PenIcon,
  ReceiptIcon,
  TrashIcon,
  type LucideIcon,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";

function getCardItem(title: string, description: string, Icon: LucideIcon) {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>

      <ItemContent>
        <ItemDescription className="font-semibold text-base w-fit shrink-0">
          {description}
        </ItemDescription>

        <ItemTitle className="text-base flex-1 text-right min-w-0 justify-end">
          {title}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}

function getHeaderLink(data: string, link: string) {
  return (
    <Link
      to={link}
      className="link w-full inline-flex justify-center items-center gap-2.5 text-5xl"
    >
      {data} <Link2Icon className="size-6" />
    </Link>
  );
}

export default function Booking() {
  const { booking }: { booking: Booking } = useLoaderData();
  const complete = useBookingComplete(booking);

  const movie = complete.movie;
  const location = complete.location;
  const format = complete.format;

  return (
    <div className="w-full h-full flex flex-row justify-center items-center p-24 gap-24">
      <Card className="h-full w-full [--card-spacing:--spacing(12)] rounded-10xl overflow-x-auto">
        <CardHeader>
          <CardTitle className="flex flex-col gap-12">
            {getHeaderLink(movie.name, `/movies/${movie.id}`)}
            {getHeaderLink(location.name, `/locations/${location.id}`)}
            {getHeaderLink(format.name, `/formats/${format.id}`)}
          </CardTitle>
        </CardHeader>

        <Separator className="h-0.75" />
        <CardContent className="w-full grid grid-cols-2 gap-5">
          {getCardItem(parseDate(complete.date), "Date", CalendarDaysIcon)}
          {complete.time &&
            getCardItem(parseTime(complete.time), "Time", Clock2Icon)}
          {complete.seats.length > 0 &&
            getCardItem(complete.seats.join(", "), "Seats", ArmchairIcon)}
          {complete.price &&
            getCardItem(`$ ${complete.price}`, "Price", ReceiptIcon)}
          {complete.external_id &&
            getCardItem(complete.external_id, "Booking ID", IdCardIcon)}
        </CardContent>

        <Separator className="h-0.75" />

        <CardFooter className="w-full flex flex-row justify-evenly items-center">
          <Button variant="secondary" className="text-lg">
            Edit
            <PenIcon data-icon="inline-end" />
          </Button>
          <Button variant="destructive" className="text-lg">
            Delete
            <TrashIcon data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>

      <div className="w-fit h-full py-12">
        <BookingCard booking={complete} contentVisible={false} />
      </div>
    </div>
  );
}
