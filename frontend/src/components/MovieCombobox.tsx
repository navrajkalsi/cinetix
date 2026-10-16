import useLookupArrays from "@/hooks/useLookupArrays";
import type { Movie, MovieCreate } from "@/models/Movie";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "./ui/combobox";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from "./ui/item";
import { Spinner2 } from "./ui/spinner2";

// interface Props { }

// data needs to be grouped to work with combobox group
interface DataGroup {
  value: "Cinetix" | "TMDB";
  items: MovieCreate[];
}

export default function MovieCombobox() {
  const [query, setQuery] = useState("");
  // database records from context
  const [database] = useLookupArrays();
  // did the user request external records
  const [extRequested, setExtRequested] = useState(false);
  // external records, null when ext not requested or when results not received yet
  const [external, setExternal] = useState<MovieCreate[] | null>(null);

  const data: DataGroup[] = [
    {
      value: "Cinetix",
      items: database as MovieCreate[],
    },
  ];

  // push external records if they have been fetched
  if (external !== null) {
    data.push({ value: "TMDB", items: external });
  }

  useEffect(() => {
    if (query.length === 0) {
      setExtRequested(false);
    } else if (extRequested) {
      const timer = setTimeout(() => setExternal(database), 1000);

      return () => clearTimeout(timer);
    }
  }, [extRequested, query]);

  // just show db results
  // and ask to load tmdb results
  if (!extRequested) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <Combobox
          itemToStringLabel={(m: MovieCreate) => m.name}
          itemToStringValue={(m: MovieCreate) => m.external_id.toString()}
          isItemEqualToValue={(i, v) => i.external_id === v.external_id}
          onValueChange={(v: MovieCreate | null) =>
            console.log("value change: ", v)
          }
          items={database}
          onInputValueChange={(input) => setQuery(input)}
          autoHighlight
        >
          <ComboboxInput placeholder="Select a Movie" />

          <ComboboxContent className="p-1">
            <ComboboxEmpty>No matches found in Cinetix.</ComboboxEmpty>

            <ComboboxList className="scrollbar-none">
              <ComboboxCollection>
                {(movie: MovieCreate) => (
                  <ComboboxItem key={movie.external_id} value={movie}>
                    {movie.name}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxList>

            {query.length > 0 && (
              // only show the external fetch button when query is no empty
              <Button
                className="flex w-full"
                onClick={() => setExtRequested(true)}
              >
                Load more results from TMDB.
              </Button>
            )}
          </ComboboxContent>
        </Combobox>
      </div>
    );
  }

  // results are loading from tmdb
  if (external === null) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <Combobox>
          <ComboboxInput placeholder="Select a Movie" />

          <ComboboxContent>
            <ComboboxEmpty>
              <Spinner2 className="size-4" />
            </ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  }

  // external results were requested and now loaded
  return (
    // itemtostringlabel calculates the string to show inside input on autocomplete
    // itemtostringvalue calculates the string to pass on form submission
    // onvaluechange is triggered when a value is selected or cleared
    <div className="w-full h-full justify-center items-center flex">
      <Combobox
        itemToStringLabel={(m: MovieCreate) => m.name}
        itemToStringValue={(m: MovieCreate) => m.external_id.toString()}
        isItemEqualToValue={(i, v) => i.external_id === v.external_id}
        onValueChange={(v: MovieCreate | null) =>
          console.log("value change: ", v)
        }
        items={data}
        onInputValueChange={(input) => setQuery(input)}
        autoHighlight
      >
        <ComboboxInput placeholder="Select a Movie" />

        <ComboboxContent>
          <ComboboxEmpty>No results found.</ComboboxEmpty>

          <ComboboxList className="scrollbar-none">
            {(group: DataGroup) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(movie: MovieCreate) => (
                    <ComboboxItem key={movie.external_id} value={movie}>
                      {movie.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
