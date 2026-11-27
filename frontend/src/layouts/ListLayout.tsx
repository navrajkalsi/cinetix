import ListItem from "@/components/ListItem";
import useLookupArrays from "@/hooks/useLookupArrays";

type EntityType = "movies" | "locations" | "formats";

interface Props {
  entity: EntityType;
}

export default function ListLayout({ entity }: Props) {
  const [movies, locations, formats] = useLookupArrays();

  const posterBase = "https://image.tmdb.org/t/p/w780";
  const mapsApiKey = "AIzaSyBXmTWlDVPBKtxFm2pejH0CII8jGJZ6vvU";

  return (
    <div className="grid grid-cols-4 size-full max-w-full max-h-full overflow-auto gap-12 p-8 pt-16">
      {entity === "movies" &&
        movies.map((movie, i) => (
          <ListItem key={i} title={movie.name} page={"/movies/" + movie.id}>
            <img aria-hidden src={posterBase + movie.poster_path} />
          </ListItem>
        ))}

      {entity === "locations" &&
        locations.map((location, i) => (
          <ListItem
            key={i}
            title={location.name}
            page={"/locations/" + location.id}
          >
            <iframe
              loading="lazy"
              className="size-full"
              src={`https://www.google.com/maps/embed/v1/place?q=place_id:${location.external_id}&key=${mapsApiKey}`}
            />
          </ListItem>
        ))}

      {entity === "formats" &&
        formats.map((format, i) => (
          <ListItem key={i} title={format.name} page={"/formats/" + format.id}>
            {format.name
              .toLowerCase()
              .split(" ")
              .map((tag, i) => (
                <img
                  key={i}
                  aria-hidden
                  src={`${tag}.svg`}
                  className="w-full max-h-1/4 p-8"
                />
              ))}
          </ListItem>
        ))}
    </div>
  );
}
