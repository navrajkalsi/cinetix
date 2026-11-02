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
import Backdrop from "@/components/Backdrop";
import { format, parseISO } from "date-fns";

const mapsApiKey = "AIzaSyBXmTWlDVPBKtxFm2pejH0CII8jGJZ6vvU";

interface EntityInfo {
  type: "movie" | "location" | "format";
  id: number;
}

type Entity = ["movie", Movie] | ["location", Location] | ["format", Format];

export interface DetailsLoaderData {
  // bookings to show in the list
  bookings: Booking[];
  entityInfo: EntityInfo;
}

export default function Details() {
  const { bookings, entityInfo }: DetailsLoaderData = useLoaderData();
  const { lookups } = useLookupsContext();

  const entity = getEntity(entityInfo, lookups);

  return (
    <div className="size-full flex p-12 gap-12">
      {getDetails(entity, bookings.length)}
      {getPreview(entity)}
      <Backdrop />
    </div>
  );
}

function getEntity(entityInfo: EntityInfo, lookups: Lookups) {
  let entity: Entity | undefined = undefined;

  switch (entityInfo.type) {
    case "movie":
      const movie = lookups.movies.get(entityInfo.id);
      if (movie) entity = ["movie", movie];
      break;

    case "location":
      const location = lookups.locations.get(entityInfo.id);
      if (location) entity = ["location", location];
      break;

    case "format":
      const format = lookups.formats.get(entityInfo.id);
      if (format) entity = ["format", format];
      break;

    default:
      throw new Response("invalid entity");
  }

  if (!entity) throw new Response("id must exist");

  return entity;
}

function getDetails(entity: Entity, bookings: number) {
  const mutiple = bookings > 1;

  return (
    <div className="size-full bg-transparent flex flex-col gap-8 font-heading">
      <div className="bg-[rgba(255,255,255,0.025)] backdrop-blur-sm rounded-10xl p-8 w-fit flex flex-col gap-2">
        {entity[0] === "movie" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to={new URL(
                `https://www.themoviedb.org/movie/${entity[1].external_id}`,
              ).toString()}
            >
              {entity[1].name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground flex gap-1">
              {entity[1].release_date && (
                <>
                  <div>{format(parseISO(entity[1].release_date), "MMM y")}</div>
                  <DotIcon />
                </>
              )}

              <div>
                Seen {bookings} time{mutiple && "s"}
              </div>
            </div>
          </>
        )}

        {entity[0] === "location" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to={new URL(
                `https://www.google.com/maps/search/?api=1&query=${entity[1].name}&query_place_id=${entity[1].external_id}`,
              ).toString()}
            >
              {entity[1].name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground flex gap-1">
              <div>{entity[1].address}</div>
              <DotIcon />
              <div>
                Visited {bookings} time{mutiple && "s"}
              </div>
            </div>
          </>
        )}

        {entity[0] === "format" && (
          <>
            <Link
              className="text-5xl link inline-flex items-center gap-3"
              to="https://www.imax.com"
            >
              {entity[1].name} <ExternalLinkIcon className="h-auto w-1em" />
            </Link>

            <div className="text-muted-foreground">
              Experienced {bookings} time{mutiple && "s"}
            </div>
          </>
        )}
      </div>

      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-10xl p-8 grow"></div>
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
        {entity[0] === "movie" && (
          <img
            loading="lazy"
            className="size-full pointer-events-none"
            src={`https://image.tmdb.org/t/p/w780${entity[1].poster_path}`}
          />
        )}

        {entity[0] === "location" && (
          <iframe
            loading="lazy"
            className="size-full"
            src={`https://www.google.com/maps/embed/v1/place?q=place_id:${entity[1].external_id}&key=${mapsApiKey}`}
          />
        )}

        {entity[0] === "format" && <div>format</div>}
      </div>
    </div>
  );
}
