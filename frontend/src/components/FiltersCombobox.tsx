import { type Movie } from "@/models/Movie";
import { type Location } from "@/models/Location";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { useMemo, useState } from "react";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { cn } from "cn";

type Entity = ["movie", Movie[]] | ["location", Location[]];
type EntityType = Movie | Location;

interface Props {
  entity: Entity;
  value: EntityType | null;
  onValueChange: (v: EntityType | null) => void;
}

export default function FiltersCombobox({
  entity,
  value,
  onValueChange,
}: Props) {
  // trimmed query in inputhandler
  const [query, setQuery] = useState("");
  const queryLower = query.toLowerCase();

  // memoized filtered items, at most 5 items
  const filtered = useMemo(
    () =>
      entity[1]
        .filter((m) => m.name.toLowerCase().includes(queryLower))
        .slice(0, 5),
    [entity, queryLower],
  );

  return (
    <Combobox
      id={entity[0] + "-combobox"}
      itemToStringLabel={(entity: EntityType) => entity.name}
      itemToStringValue={(entity: EntityType) => entity.external_id.toString()}
      isItemEqualToValue={(i: EntityType, v: EntityType) =>
        i.external_id === v.external_id
      }
      items={filtered}
      filter={null} // filtering is manually handled
      onInputValueChange={setQuery}
      onValueChange={(v) => onValueChange(v)}
      value={value}
      autoHighlight
    >
      <ComboboxInput
        placeholder={entity[0].replace(
          entity[0].charAt(0),
          entity[0].charAt(0).toUpperCase(),
        )}
        spellCheck={false}
      />
      <ComboboxContent className="p-1">
        <ComboboxEmpty>No matches found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(item: EntityType) => (
              <ComboboxItem key={item.external_id} value={item} className="p-2">
                <Item size="sm" className="p-0">
                  <ItemContent
                    className={cn(
                      entity[0] === "movie" &&
                      "flex flex-row items-center justify-between",
                    )}
                  >
                    <ItemTitle>{item.name}</ItemTitle>
                    <ItemDescription className="text-xs">
                      {entity[0] === "location" && item.address}
                      {entity[0] === "movie" &&
                        item.release_date !== null &&
                        // show release year if available
                        item.release_date.split("-", 1)[0]}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
