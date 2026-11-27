import type { StatsFull } from "@/models/Stats";
import { type JSX } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DollarSignIcon,
  EyeIcon,
  FaceSlightlyFrowningIcon,
  FilmIcon,
  HourglassIcon,
  MapPinCheckIcon,
  ProjectorIcon,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { Separator } from "./ui/separator";
import type { Lookups } from "@/context/LookupContext";
import RankCard from "./RankCard";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/api/stats";
import { parseYear } from "@/filters";
import { Spinner } from "./ui/spinner";
import useStats from "@/hooks/useStats";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

interface Slide {
  title: string;
  jsx: (stats: StatsFull, lookups?: Lookups) => JSX.Element;
}

const Slides: Slide[] = [
  { title: "Overview", jsx: overviewSlide },
  { title: "Movies", jsx: moviesSlide },
  { title: "Locations", jsx: locationsSlide },
  { title: "Formats", jsx: formatsSlide },
] as const;

export default function Stats() {
  const [params] = useSearchParams();
  const year = parseYear(params.get("year") ?? "");
  const { isPending, error, data } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => await getStats(year),
  });

  const stats = useStats(data);

  if (isPending || !stats) return <Spinner className="size-8" />;
  if (error) throw error;

  if (stats.bookings === 0) return emptySlide(stats.year);

  return (
    <Carousel opts={{ loop: true }} className="size-full">
      <CarouselContent className="size-full">
        {Slides.map((slide, i) => (
          <CarouselItem className="size-full" key={i}>
            {slide.jsx(stats)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

const bolden = (s: string) => (
  <span className="font-bold text-accent">{s}</span>
);

function emptySlide(year: number | null) {
  return (
    <Empty className="size-1/2 m-auto flex-initial bg-background/80">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FaceSlightlyFrowningIcon />
        </EmptyMedia>

        <EmptyTitle>Nothing to see here!</EmptyTitle>

        <EmptyDescription>
          <div>
            {year ? (
              <>You have no bookings for {bolden(year.toString())}</>
            ) : (
              <>You have no bookings added to {bolden("Cinetix")}</>
            )}
          </div>
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>Try changing the year</EmptyContent>
    </Empty>
  );
}

function overviewSlide(stats: StatsFull) {
  return (
    <Card className="size-full [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <span className="font-heading text-2xl text-center relative group">
            {stats.year ? (
              <>
                Your <span className="font-bold text-accent">{stats.year}</span>{" "}
                at the movies
              </>
            ) : (
              "You at the movies"
            )}
            <div className="absolute w-full h-1 -bottom-1.5 bg-accent rounded-full duration-200 group-hover:w-0 animate-grow" />
          </span>
        </CardTitle>
      </CardHeader>

      <Separator className="h-0.5" />

      <CardContent className="grid grid-cols-3 gap-5 grow">
        {gridItem(stats.bookings, EyeIcon, "Total visits")}
        {gridItem(stats.movies, FilmIcon, "Movies watched")}
        {gridItem(stats.locations, MapPinCheckIcon, "Locations visited")}
        {gridItem(stats.formats, ProjectorIcon, "Formats experienced")}
        {totalTime(stats)}
        {totalCost(stats)}
      </CardContent>

      <Separator className="h-0.5" />

      <CardFooter className="justify-center italic">
        Swipe to next slides to discover more!
      </CardFooter>
    </Card>
  );
}

function moviesSlide(stats: StatsFull) {
  if (stats.most_watched_movies.length === 0) return <></>;

  // use 500 width for posters
  const posterBase = "https://image.tmdb.org/t/p/w500";

  return (
    <Card className="size-full max-h-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Most watched movies
        </CardTitle>
      </CardHeader>

      <CardContent className="flex size-full max-h-full justify-evenly items-center gap-5 my-auto">
        {stats.most_watched_movies.map(([movie, times], index) => (
          <RankCard
            title={movie.name}
            rank={++index}
            times={times}
            participle="Seen"
            key={index}
          >
            <img
              src={posterBase + movie.poster_path}
              aria-hidden
              className="size-full object-cover object-center"
            />
          </RankCard>
        ))}
      </CardContent>
    </Card>
  );
}

function locationsSlide(stats: StatsFull) {
  if (stats.most_visited_locations.length === 0) return <></>;

  const mapsApiKey = "AIzaSyBXmTWlDVPBKtxFm2pejH0CII8jGJZ6vvU";

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Most visited locations
        </CardTitle>
      </CardHeader>

      <CardContent className="flex size-full justify-evenly items-center gap-5 my-auto">
        {stats.most_visited_locations.map(([location, times], index) => (
          <RankCard
            title={location.name}
            rank={++index}
            times={times}
            participle="Visited"
            key={index}
          >
            <iframe
              loading="lazy"
              className="size-full"
              src={`https://www.google.com/maps/embed/v1/place?q=place_id:${location.external_id}&key=${mapsApiKey}`}
            />
          </RankCard>
        ))}
      </CardContent>
    </Card>
  );
}

function formatsSlide(stats: StatsFull) {
  if (stats.most_experienced_formats.length == 0) return <></>;

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Most experienced formats
        </CardTitle>
      </CardHeader>

      <CardContent className="flex size-full justify-evenly items-center gap-5 my-auto">
        {stats.most_experienced_formats.map(([format, times], index) => (
          <RankCard
            title={format.name}
            rank={++index}
            times={times}
            participle="Experienced"
            key={index}
          >
            {format.name
              .toLowerCase()
              .split(" ")
              .map((tag, i) => (
                <img
                  key={i}
                  src={`/${tag}.svg`}
                  aria-hidden
                  className="w-full max-h-1/4 p-4"
                />
              ))}
          </RankCard>
        ))}
      </CardContent>
    </Card>
  );
}

function gridItem(
  title: string | number,
  Icon: LucideIcon,
  desc: string,
  note?: string,
) {
  return (
    <Item variant="outline">
      <ItemContent className="flex-col size-full justify-between p-2">
        <ItemTitle className="self-end text-5xl font-bold font-heading text-right">
          {title}
        </ItemTitle>
        <ItemDescription className="flex flex-col gap-2">
          <div className="inline-flex w-full justify-end items-center font-semibold">
            <Icon className="size-4.5 mr-1" />
            {desc}
            {note && <span className="text-destructive ml-0.5">*</span>}
          </div>
          {note && <div className="text-xs self-end text-right">{note}</div>}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

// adds avg runtime to bookings with missing runtime
// converts time to a formated string
function totalTime(stats: StatsFull) {
  const avgRuntime = 110; // avg runtime of a movie to add for unaccounted for movies

  if (!stats.bookings_without_minutes)
    // just format and return grid item
    return gridItem(
      stats.minutes / 60 > 1
        ? `${Math.trunc(stats.minutes / 60)}h ${stats.minutes % 60}m`
        : `${stats.minutes}m`,
      HourglassIcon,
      "Time spent",
    );

  const final = stats.minutes + stats.bookings_without_minutes * avgRuntime;

  return gridItem(
    final / 60 > 1 ? `${Math.trunc(final / 60)}h ${final % 60}m` : `${final}m`,
    HourglassIcon,
    "Time spent",
    `Adjusted for ${stats.bookings_without_minutes} booking${stats.bookings_without_minutes > 1 ? "s" : ""} without runtime using average runtime of ${avgRuntime}m per movie.`,
  );
}

function totalCost(stats: StatsFull) {
  const avgTicket = 12.5;

  if (!stats.bookings_without_cost)
    return gridItem("$" + stats.cost, DollarSignIcon, "Cost");

  const final = Number(stats.cost) + stats.bookings_without_cost * avgTicket;

  return gridItem(
    "$" + final,
    DollarSignIcon,
    "Cost",
    `Adjusted for ${stats.bookings_without_cost} booking${stats.bookings_without_cost > 1 ? "s" : ""} without cost using average cost of $${avgTicket} per ticket.`,
  );
}
