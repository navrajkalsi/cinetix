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
import { Fragment, useEffect, useMemo, useState, type Ref } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { fetchExternalMovies } from "@/api/movies";
import { toast } from "./ui/toast";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { Field, FieldError, FieldLabel } from "./ui/field";
import type { ControllerFieldState } from "react-hook-form";

// props that react hook form requires to communicate with this input
// taken from:  https://react-hook-form.com/docs/usecontroller/controller
interface Props {
  onChange: (value?: MovieCreate) => void;
  onBlur: () => void;
  // current selected, if any
  value?: MovieCreate;
  disabled?: boolean;
  name: string;
  ref: Ref<HTMLInputElement>;
  fieldState: ControllerFieldState;
}

// data needs to be grouped to work with combobox group
interface DataGroup {
  value: "Cinetix" | "TMDB";
  items: MovieCreate[];
}

export default function MovieCombobox({
  onChange,
  onBlur,
  value,
  disabled,
  name,
  ref,
  fieldState,
}: Props) {
  // trimmed query in inputhandler
  const [query, setQuery] = useState("");
  // database records from context, already memoized
  const [database] = useLookupArrays();
  // did the user request external records
  const [extRequested, setExtRequested] = useState(false);
  // external records, null when ext not requested or when results not received yet
  const [external, setExternal] = useState<MovieCreate[] | null>(null);
  // error during external records fetching
  // this is NOT a validation error
  // validation errors are handled by the parent form
  const [error, setError] = useState<string | null>(null);

  const queryLower = query.toLowerCase();
  // did the user change the value after making a selection
  // only valid when value is defined
  const valueDirty =
    query !== "" && value !== undefined && query !== value.name;
  const loading =
    extRequested &&
    external === null &&
    error === null &&
    (!value || valueDirty);

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

    if (error !== null) setError(null);

    // user cleared the input
    // also reset tmdb on error
    if (extRequested && (value.length === 0 || error !== null))
      setExtRequested(false);
  }

  // use an effect so the request does not pause our rendering
  useEffect(() => {
    if (!extRequested || error !== null || (value && !valueDirty)) return; // only fetch on no error and when no value is selected or if the selected value has been changed.

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
  }, [extRequested, query, error, value, valueDirty]);

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
    <Field data-invalid={fieldState.invalid} className="col-span-full">
      <FieldLabel htmlFor="movie-combobox">
        Movie<span className="text-destructive">*</span>
      </FieldLabel>

      <Combobox
        id="movie-combobox"
        itemToStringLabel={(m: MovieCreate) => m.name}
        itemToStringValue={(m: MovieCreate) => m.external_id.toString()}
        isItemEqualToValue={(i, v) => i.external_id === v.external_id}
        onValueChange={(v) => {
          setExtRequested(false);
          // erase value in form, instead of making it null
          // is returned to this comp via value in the props
          onChange(v ?? undefined); // rhf
        }}
        // if not grouped, the user has not requested data from tmdb yet
        items={externalFiltered === null ? databaseFiltered : data}
        filter={null} // filtering is manually handled
        onInputValueChange={handleInputChange}
        autoHighlight
        disabled={disabled} // from rhf
        value={value ?? null}
      >
        <ComboboxInput
          placeholder="The Odyssey"
          aria-invalid={fieldState.invalid || (extRequested && error !== null)}
          ref={ref}
          onBlur={onBlur} // from rhf
          disabled={disabled} // from rhf
          name={name} // from rhf
          spellCheck={false}
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

              <ComboboxList>
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
                      setExtRequested(true);
                    }}
                  >
                    Load more results from TMDB.
                  </Button>
                </div>
              )}

              {extRequested && error !== null && (
                // this error is just for fetching, not validation
                <div className="w-full flex-col">
                  <ComboboxSeparator />
                  <div className="w-full text-center py-1 text-xs text-destructive">
                    Failed to fetch TMDB results.
                  </div>
                  <Button
                    className="w-full whitespace-normal h-fit p-1"
                    onMouseDown={(e) => {
                      e.preventDefault(); // stop blur so that keyboard shortcuts will focus on input
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

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

function showErrorToast(error: string) {
  toast.add({ description: error, type: "error", priority: "high" });
}
