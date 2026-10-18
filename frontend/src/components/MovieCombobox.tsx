import useLookupArrays from "@/hooks/useLookupArrays";
import { type MovieCreate } from "@/models/Movie";
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
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { fetchExternalMovies } from "@/api/movies";
import { toast } from "./ui/toast";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";

// data needs to be grouped to work with combobox group
interface DataGroup {
  value: "Cinetix" | "TMDB";
  items: MovieCreate[];
}

export default function MovieCombobox() {
  // trimmed query in inputhandler
  const [query, setQuery] = useState("");
  // database records from context, already memoized
  const [database] = useLookupArrays();
  // did the user request external records
  const [extRequested, setExtRequested] = useState(false);
  // external records, null when ext not requested or when results not received yet
  const [external, setExternal] = useState<MovieCreate[] | null>(null);
  // selected value is stored so no request is sent to tmdb when selected item is entered in the input
  const [selected, setSelected] = useState<MovieCreate | null>(null);
  // error during external records fetching
  const [error, setError] = useState<string | null>(null);
  // input ref for refocusing on button press
  const inputRef = useRef<HTMLInputElement | null>(null);

  const queryLower = query.toLowerCase();
  const loading =
    extRequested && external === null && error === null && selected === null;

  // memoized filtered items, at most 5 items
  const databaseFiltered = useMemo(
    () =>
      database
        .filter((m) => m.name.toLowerCase().includes(queryLower))
        .slice(0, 5) as MovieCreate[],
    [database, queryLower],
  );
  // external is already filtered with search term but may contain duplicates
  const externalFiltered = useMemo(() => {
    if (external === null) return null;

    // unique movie ids already present, to prevent duplication
    const databaseIds = new Set(databaseFiltered.map((m) => m.external_id));
    return external.filter((m) => !databaseIds.has(m.external_id)).slice(0, 5);
  }, [external, databaseFiltered]);

  function handleInputChange(input: string) {
    const value = input.trim();
    if (query === value) return;

    setQuery(value);
    setExternal(null);

    if (selected !== null) setSelected(null);
    if (error !== null) setError(null);

    // user cleared the input
    // also reset tmdb on error
    if (extRequested && (value.length === 0 || error !== null))
      setExtRequested(false);
  }

  // use an effect so the request does not pause our rendering
  useEffect(() => {
    if (!extRequested || selected !== null || error !== null) return; // only fetch when no selected and the user requested

    // fetch new res
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const [error, response] = await fetchExternalMovies(
        query,
        controller.signal,
      );

      if (controller.signal.aborted) return; // only update if not aborted
      if (error === null) return setExternal(response);

      showErrorToast(error.reason);
      setError(error.reason);
    }, 300);

    return () => {
      controller.abort("fetched search term invalidated");
      clearTimeout(timer);
    };
  }, [extRequested, query, selected, error]);

  // filtered data
  const data: DataGroup[] = [
    {
      value: "Cinetix",
      items: databaseFiltered,
    },
  ];

  // push external records if they have been fetched
  if (externalFiltered !== null) {
    data.push({ value: "TMDB", items: externalFiltered });
  }

  // just show db results
  // and ask to load tmdb results
  return (
    <Combobox
      itemToStringLabel={(m: MovieCreate) => m.name}
      itemToStringValue={(m: MovieCreate) => m.external_id.toString()}
      isItemEqualToValue={(i, v) => i.external_id === v.external_id}
      onValueChange={(v) => {
        setExtRequested(false);
        setSelected(v);
      }}
      // if not grouped, the user has not requested data from tmdb yet
      items={externalFiltered === null ? databaseFiltered : data}
      filter={null} // filtering is manually handled
      onInputValueChange={handleInputChange}
      autoHighlight
    >
      <ComboboxInput
        placeholder="Select a Movie"
        aria-invalid={extRequested && error !== null}
        ref={inputRef}
        required
      />

      <ComboboxContent className="p-1">
        {loading ? (
          <Spinner className="size-4 w-full flex" />
        ) : (
          <>
            <ComboboxEmpty>
              {externalFiltered === null
                ? "No results found in Cinetix."
                : "No results found."}
            </ComboboxEmpty>

            <ComboboxList className="scrollbar-none">
              {externalFiltered === null ? (
                <ComboboxCollection>
                  {(movie: MovieCreate) => (
                    <ComboboxItem key={movie.external_id} value={movie}>
                      <Item size="sm" className="p-0">
                        <ItemContent>
                          <ItemTitle>{movie.name}</ItemTitle>
                        </ItemContent>
                        {movie.release_date !== null && (
                          // show release year if available
                          <ItemContent>
                            <ItemDescription className="text-xs flex-none text-center">
                              {movie.release_date.split("-", 1)[0]}
                            </ItemDescription>
                          </ItemContent>
                        )}
                      </Item>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              ) : (
                (group: DataGroup, index) => (
                  <Fragment key={index}>
                    <ComboboxGroup key={index} items={group.items}>
                      <ComboboxLabel>{group.value}</ComboboxLabel>
                      <ComboboxCollection>
                        {(movie: MovieCreate) => (
                          <ComboboxItem key={movie.external_id} value={movie}>
                            <Item size="sm" className="p-0">
                              <ItemContent>
                                <ItemTitle>{movie.name}</ItemTitle>
                              </ItemContent>
                              {movie.release_date !== null && (
                                // show release year if available
                                <ItemContent>
                                  <ItemDescription className="text-xs flex-none text-center">
                                    {movie.release_date.split("-", 1)[0]}
                                  </ItemDescription>
                                </ItemContent>
                              )}
                            </Item>
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxGroup>

                    {databaseFiltered.length > 0 && index === 0 && (
                      <ComboboxSeparator />
                    )}
                  </Fragment>
                )
              )}
            </ComboboxList>

            {query.length > 0 && !extRequested && (
              // only show the external fetch button when query is no empty
              <div className="w-full flex-col">
                <ComboboxSeparator />
                <Button
                  className="w-full whitespace-normal h-fit p-1"
                  onMouseDown={(e) => {
                    e.preventDefault(); // stop blur so that keyboard shortcuts with focus on input
                    inputRef.current?.focus();
                    setExtRequested(true);
                  }}
                >
                  Load more results from TMDB.
                </Button>
              </div>
            )}

            {extRequested && error !== null && (
              <div className="w-full flex-col">
                <ComboboxSeparator />
                <div className="w-full text-center py-1 text-xs text-destructive">
                  Failed to fetch TMDB results.
                </div>
                <Button
                  className="w-full whitespace-normal h-fit p-1"
                  onMouseDown={(e) => {
                    e.preventDefault(); // stop blur so that keyboard shortcuts with focus on input
                    inputRef.current?.focus();
                    setError(null);
                  }}
                >
                  Try again.
                </Button>
              </div>
            )}
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}

function showErrorToast(error: string) {
  toast.add({ description: error, type: "error", priority: "high" });
}
