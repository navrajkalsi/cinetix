import type Stats from "@/models/Stats";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  model: Stats;
}

export default function Stats({ model }: Props) {
  const slides = [1, 2, 3, 4, 5];

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

  return (
    <div className="flex w-full max-w-[10rem] flex-col items-center gap-3 sm:max-w-xs">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-semibold text-4xl">{slide}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
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
