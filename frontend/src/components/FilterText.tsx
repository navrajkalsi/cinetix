import type { Filter, FilterData } from "@/filters";
import useLookupsContext from "@/hooks/useLookupsContext";

interface Props {
  filter: Filter;
  data: FilterData;
}

export function FilterText({ filter, data }: Props) {
  const { lookups } = useLookupsContext();

  const bolden = (s: string) => <span className="font-bold">{s}</span>;

  switch (filter) {
    case "year":
      return data ? <>in {bolden(data.toString())}</> : <></>;
    case "movieId":
      const movie = data ? lookups.movies.get(data) : undefined;
      return movie ? <>for {bolden(movie.name)}</> : <></>;
    case "locationId":
      const location = data ? lookups.locations.get(data) : undefined;
      return location ? <>at {bolden(location.name)}</> : <></>;
    case "formatId":
      const format = data ? lookups.formats.get(data) : undefined;
      return format ? <>in {bolden(format.name)}</> : <></>;
  }
}
