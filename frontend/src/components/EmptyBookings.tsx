import type { LoaderData } from "@/loaders";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { TrashIcon } from "lucide-react";
import { FilterText } from "./FilterText";

interface Props {
  // exlude null filters for bookingsnew page
  filters: Exclude<LoaderData["filters"], null>;
  future?: boolean;
}

export default function EmtpyBookings({ filters, future = false }: Props) {
  const year = future
    ? new Date().getFullYear()
    : "year" in filters
      ? filters.year
      : undefined;

  return (
    <Empty className="border border-dashed size-fit m-auto flex-initial bg-background/80">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrashIcon />
        </EmptyMedia>

        <EmptyTitle>Houseempty!</EmptyTitle>

        <EmptyDescription>
          No {future && "upcoming or recent"} bookings found
          {year && <FilterText filter="year-booking" data={year} />}
          {"movieId" in filters && (
            <FilterText filter="movieId" data={filters.movieId} />
          )}
          {"locationId" in filters && (
            <FilterText filter="locationId" data={filters.locationId} />
          )}
          {"formatId" in filters && (
            <FilterText filter="formatId" data={filters.formatId} />
          )}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>Try changing the filters</EmptyContent>
    </Empty>
  );
}
