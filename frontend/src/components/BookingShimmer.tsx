import { Skeleton } from "./ui/skeleton";

export default function BookingShimmer() {
  return (
    <div className="absolute flex flex-row gap-20 p-20 w-full h-full z-50 bg-background">
      <div className="flex flex-col gap-25 w-full">
        <Skeleton className="h-1/4" />
        <Skeleton className="h-3/4" />
      </div>

      <Skeleton className="rounded-10xl h-full aspect-2/3" />
    </div>
  );
}
