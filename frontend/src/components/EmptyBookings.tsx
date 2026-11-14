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
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrashIcon />
        </EmptyMedia>

        <EmptyTitle>Houseempty!</EmptyTitle>

        <EmptyDescription>
          No {future && "upcoming or recent"} bookings found&nbsp;
          {year && (
            <>
              for year <span className="font-bold">{year}</span>
            </>
          )}
          {"movieId" in filters && (
            <FilterText filter="movieId" data={filters.movieId} />
          )}
          &nbsp;
          {"locationId" in filters && (
            <FilterText filter="locationId" data={filters.locationId} />
          )}
          &nbsp;
          {"formatId" in filters && (
            <FilterText filter="formatId" data={filters.formatId} />
          )}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>Try changing the filters</EmptyContent>
    </Empty>
  );
}
