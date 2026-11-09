// Provides a layout for displaying details of a specific movie, location or format.
// Displays the matching bookings for the entity.

import type { Booking } from "@/models/Booking";
import type { Format } from "@/models/Format";
import type { Movie } from "@/models/Movie";
import type { Location } from "@/models/Location";
import { Link, useLoaderData } from "react-router";
import useLookupsContext from "@/hooks/useLookupsContext";
import type { Lookups } from "@/context/LookupContext";
import { DotIcon, ExternalLinkIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import BookingItem from "@/components/BookingItem";
import type { LoaderData } from "@/loaders";

const mapsApiKey = "AIzaSyBXmTWlDVPBKtxFm2pejH0CII8jGJZ6vvU";

export type MovieData = Extract<LoaderData, { path: "movie" }>;
export type LocationData = Extract<LoaderData, { path: "location" }>;
export type FormatData = Extract<LoaderData, { path: "format" }>;

type DetailsLoaderData = MovieData | LocationData | FormatData;
type Paths = DetailsLoaderData["path"];

type EntityMap = {
  movie: Movie;
  location: Location;
  format: Format;
};

export type Entity = { [P in Paths]: { type: P; data: EntityMap[P] } }[Paths];

export default function Details() {
  const { path, id, bookings, filters }: DetailsLoaderData = useLoaderData();
  const { lookups } = useLookupsContext();

  const entity = getEntity(path, id, lookups);

  return (
    <div className="size-full flex p-12 gap-12">
      {getDetails(entity, bookings)}
      {getPreview(entity)}
    </div>
  );
}

// return path is the same as input path
function getEntity<P extends Paths>(
  path: P,
  id: number,
  lookups: Lookups,
): Extract<Entity, { path: P }> {
  let entity: Entity | undefined = undefined;

  switch (path) {
    case "movie":
      const movie = lookups.movies.get(id);
      if (movie) entity = { type: path, data: movie };
      break;

    case "location":
      const location = lookups.locations.get(id);
      if (location) entity = { type: path, data: location };
      break;

    case "format":
      const format = lookups.formats.get(id);
      if (format) entity = { type: path, data: format };
      break;

    default:
      throw new Response("invalid entity");
  }

  if (!entity) throw new Response("id must exist");

  return entity as Extract<Entity, { path: P }>;
}

function getDetails(entity: Entity, bookings: Booking[]) {
  const mutiple = bookings.length > 1;

  return (
    <div className="size-full bg-transparent flex flex-col gap-8 font-heading">
      <div className="bg-foreground/5 backdrop-blur-sm rounded-10xl p-8 w-fit flex flex-col gap-2">
        {entity.type === "movie" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to={new URL(
                `https://www.themoviedb.org/movie/${entity.data.external_id}`,
              ).toString()}
            >
              {entity.data.name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground flex gap-1">
              {entity.data.release_date && (
                <>
                  <div>
                    {format(parseISO(entity.data.release_date), "MMM y")}
                  </div>
                  <DotIcon />
                </>
              )}

              <div>
                Seen {bookings.length} time{mutiple && "s"}
              </div>
            </div>
          </>
        )}

        {entity.type === "location" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to={new URL(
                `https://www.google.com/maps/search/?api=1&query=${entity.data.name}&query_place_id=${entity.data.external_id}`,
              ).toString()}
            >
              {entity.data.name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground flex gap-1">
              <div>{entity.data.address}</div>
              <DotIcon />
              <div>
                Visited {bookings.length} time{mutiple && "s"}
              </div>
            </div>
          </>
        )}

        {entity.type === "format" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to="https://www.imax.com"
            >
              {entity.data.name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground">
              Experienced {bookings.length} time{mutiple && "s"}
            </div>
          </>
        )}
      </div>

      {
        // make sure the scrollbar starts in the inner container
      }
      <div className="bg-foreground/5 backdrop-blur-sm rounded-10xl py-8 px-4 size-full overflow-hidden">
        <div className="bg-transparent size-full overflow-y-auto px-4 gap-8 flex flex-col">
          {bookings.map((booking, i) => (
            <BookingItem booking={booking} key={i} hideField={entity.type} />
          ))}
        </div>
      </div>
    </div>
  );
}

function getPreview(entity: Entity) {
  // the first div will shrink in width to maintain ratio, but will lose the ratio when h is much more than width
  // in that case the w will be capped at 40%
  // but then the inner div will take over and scale its height to maintain the aspect ratio
  return (
    <div className="aspect-2/3 max-w-2/5 h-full w-auto flex items-center">
      <div className="aspect-2/3 w-full h-auto rounded-10xl overflow-auto">
        {entity.type === "movie" && (
          <img
            loading="lazy"
            className="size-full pointer-events-none"
            src={`https://image.tmdb.org/t/p/w780${entity.data.poster_path}`}
          />
        )}

        {entity.type === "location" && (
          <iframe
            loading="lazy"
            className="size-full"
            src={`https://www.google.com/maps/embed/v1/place?q=place_id:${entity.data.external_id}&key=${mapsApiKey}`}
          />
        )}

        {entity.type === "format" && <div>format</div>}
      </div>
    </div>
  );
}
