// Provides a layout for displaying details of a specific movie, location or format.
// Displays the matching bookings for the entity.

import type { Booking } from "@/models/Booking";
import type { Format } from "@/models/Format";
import type { Movie } from "@/models/Movie";
import type { Location } from "@/models/Location";
import { Link, useLoaderData } from "react-router";
import useLookupsContext from "@/hooks/useLookupsContext";
import type { Lookups } from "@/context/LookupContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLinkIcon, Link2Icon, LinkIcon } from "lucide-react";

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
    <div className="w-full h-full flex flex-row justify-center items-center p-4 gap-4 sm:p-12 sm:gap-12">
      {getDetails(entity)}
      {getPreview(entity)}
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

function getDetails(entity: Entity) {
  return (
    <Card className="grow h-full [--card-spacing:--spacing(12)] rounded-10xl overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-5xl">
          {entity[0] === "movie" && (
            <Link
              className="link inline-flex items-center justify-end gap-2 text-4xl"
              to={new URL(
                `https://www.themoviedb.org/movie/${entity[1].external_id}`,
              ).toString()}
            >
              {entity[1].name} <ExternalLinkIcon className="h-1em w-1em" />
            </Link>
          )}

          {entity[0] === "location" && (
            <Link
              className="link inline-flex items-center justify-end gap-2 text-4xl"
              to={new URL(
                `https://www.google.com/maps/search/?api=1&query=${entity[1].name}&query_place_id=${entity[1].external_id}`,
              ).toString()}
            >
              {entity[1].name} <ExternalLinkIcon className="size-5" />
            </Link>
          )}

          {entity[0] === "format" && entity[1].name}
        </CardTitle>
      </CardHeader>

      <Separator className="h-0.75" />
      <CardContent className="w-full grid grid-cols-2 gap-5"></CardContent>
    </Card>
  );
}

function getPreview(entity: Entity) {
  return (
    <div className="max-h-full h-fit w-fit rounded-10xl basis-2/5 grow-0 shrink">
      {entity[0] === "movie" && (
        <img
          className="aspect-2/3 h-full w-full object-contain bg-red-100"
          src={`https://image.tmdb.org/t/p/w780${entity[1].poster_path}`}
        />
      )}

      {entity[0] === "location" && (
        <iframe
          className="w-full h-full"
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?q=place_id:${entity[1].external_id}&key=${mapsApiKey}`}
        />
      )}

      {entity[0] === "format" && <div>format</div>}
    </div>
  );
}
