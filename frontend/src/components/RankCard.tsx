import type { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";

interface Props {
  title: string;
  rank: number;
  times: number;
  participle: "Seen" | "Visited" | "Experienced";
  children: ReactNode;
}

const bolden = (s: string | number) => <span className="font-bold">{s}</span>;

export default function RankCard({
  title,
  rank,
  times,
  participle,
  children,
}: Props) {
  return (
    <Card className="size-full justify-evenly">
      <CardContent className="size-full">
        <div className="size-full relative rounded-3xl overflow-hidden">
          {children}
          <div className="bg-black/20 absolute size-full z-10 top-0 left-0" />
          <div className="z-10 absolute right-3 bottom-2 font-heading text-9xl font-extrabold">
            {rank}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="whitespace-nowrap truncate font-heading text-[1.25em] font-semibold max-w-full">
          {title}
        </div>
        <div className="font-sans text-[0.9em]">
          {participle} {bolden(times)} times
        </div>
      </CardFooter>
    </Card>
  );
}
