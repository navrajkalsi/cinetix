import type Stats from "@/models/Stats";
import { useEffect, useState, type JSX } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FilmIcon,
  GhostIcon,
  MapPinCheckIcon,
  ProjectorIcon,
} from "lucide-react";
import type { LoaderData } from "@/loaders";
import { useLoaderData } from "react-router";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./ui/item";
import { Separator } from "./ui/separator";

interface Props {
  stats: Stats;
}

export type StatsData = Extract<LoaderData, { path: "stats" }>;

interface Slide {
  index: number;
  title: string;
  jsx: (stats: Stats) => JSX.Element;
}

function demo(stats: Stats) {
  return <></>;
}

const Slides: Slide[] = [
  { index: 1, title: "Overview", jsx: overviewSlide },
  { index: 2, title: "Movie", jsx: demo },
  { index: 3, title: "Location", jsx: demo },
  { index: 4, title: "Format", jsx: demo },
  { index: 5, title: "Time", jsx: demo },
  { index: 6, title: "Cost", jsx: demo },
];

export default function Stats() {
  const { path, stats, filters }: StatsData = useLoaderData();

  // for manual indexing
  const [api, setApi] = useState<CarouselApi>();
  const [snaps, setSnaps] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);

  // One dot per place the carousel can stop, kept in step with every move.
  useEffect(() => {
    if (!api) {
      return;
    }
    const update = () => {
      setSnaps(api.scrollSnapList());
      setCurrent(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  if (stats.bookings === 0) return emptySlide(stats.year);

  return (
    <div className="flex size-full flex-col items-center gap-3 m-auto bg-background/50 justify-center">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {Slides.map((slide) => (
            <CarouselItem key={slide.index}>{slide.jsx(stats)}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center gap-2">
        {snaps.map((snap, index) => (
          <button
            aria-current={index === current ? "true" : undefined}
            aria-label={`Go to slide ${index + 1}`}
            className="size-2 rounded-full bg-foreground opacity-64 data-current:opacity-100"
            data-current={index === current ? "" : undefined}
            key={snap}
            onClick={() => api?.scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

const bolden = (s: string) => (
  <span className="font-bold text-accent">{s}</span>
);

function emptySlide(year: number | null) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nothing to see here :(</CardTitle>
      </CardHeader>

      <CardContent>
        <GhostIcon />

        <div>
          {year ? (
            <>You have no bookings for {bolden(year.toString())}</>
          ) : (
            <>You have no bookings added to {bolden("Cinetix")}</>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function overviewSlide(stats: Stats) {
  return (
    <Card className="size-full [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {stats.year ? (
            <>
              Your <span className="font-bold text-accent">{stats.year}</span>{" "}
              at the movies.
            </>
          ) : (
            "You at the movies."
          )}
        </CardTitle>
      </CardHeader>

      <Separator className="h-0.5" />

      <CardContent className="flex flex-col gap-3">
        <Item variant="muted" className="flex flex-row items-center">
          <ItemMedia variant="icon">
            <FilmIcon />
          </ItemMedia>
          <ItemContent className="flex-row justify-between items-center">
            <ItemDescription>Movies watched</ItemDescription>
            <ItemTitle>{stats.movies}</ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="muted">
          <ItemMedia variant="icon">
            <MapPinCheckIcon />
          </ItemMedia>
          <ItemContent className="flex-row justify-between items-center">
            <ItemDescription>Locations visited</ItemDescription>
            <ItemTitle>{stats.locations}</ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="muted">
          <ItemMedia variant="icon">
            <ProjectorIcon />
          </ItemMedia>
          <ItemContent className="flex-row justify-between items-center">
            <ItemDescription>Formats experienced</ItemDescription>
            <ItemTitle>{stats.formats}</ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>

      <Separator className="h-0.5" />

      <CardFooter className="justify-center">
        Swipe to next slides to discover more!
      </CardFooter>
    </Card>
  );
}

function moviesSlide(stats: Stats) {
  return (
    <Card>
      <CardContent>
        {stats.year ? (
          <>
            Your <span className="font-bold text-accent">{stats.year}</span> at
            the movies.
          </>
        ) : (
          "You at the movies."
        )}
      </CardContent>
    </Card>
  );
}
