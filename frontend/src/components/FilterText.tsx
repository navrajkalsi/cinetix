import type { Filter, FilterData } from "@/filters";
import useLookupsContext from "@/hooks/useLookupsContext";

interface Props {
  filter: Filter | "year-booking";
  data: FilterData;
}

export function FilterText({ filter, data }: Props) {
  const { lookups } = useLookupsContext();

  const bolden = (s: string) => (
    <span className="font-bold text-accent">{s}</span>
  );

  switch (filter) {
    case "year-booking":
      return data ? <> for {bolden(data.toString())}</> : <></>;
    case "year":
      return data ? <> in {bolden(data.toString())}</> : <></>;
    case "movieId":
      const movie = data ? lookups.movies.get(data) : undefined;
      return movie ? <> for {bolden(movie.name)}</> : <></>;
    case "locationId":
      const location = data ? lookups.locations.get(data) : undefined;
      return location ? <> at {bolden(location.name)}</> : <></>;
    case "formatId":
      const format = data ? lookups.formats.get(data) : undefined;
      return format ? <> in {bolden(format.name)}</> : <></>;
  }
}
