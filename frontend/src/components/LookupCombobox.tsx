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

export type Entity = ["movie", Movie[]] | ["location", Location[]];
type EntityType = Movie | Location;

interface Props {
  entity: Entity;
}

export default function LookupCombobox({ entity }: Props) {
  // trimmed query in inputhandler
  const [query, setQuery] = useState("");
  const queryLower = query.toLowerCase();
  const entityType = entity[0];

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
      id="combobox"
      itemToStringLabel={(entity: EntityType) => entity.name}
      itemToStringValue={(entity: EntityType) => entity.external_id.toString()}
      isItemEqualToValue={(i: EntityType, v: EntityType) =>
        i.external_id === v.external_id
      }
      items={filtered}
      filter={null} // filtering is manually handled
      onInputValueChange={setQuery}
      autoHighlight
    >
      <ComboboxInput placeholder={titleCase(entity[0])} spellCheck={false} />
      <ComboboxContent className="p-1">
        <ComboboxEmpty>No matches found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(entity: EntityType) => (
              <ComboboxItem key={entity.external_id} value={entity}>
                <Item size="sm" className="p-0">
                  <ItemContent>
                    <ItemTitle>{entity.name}</ItemTitle>
                    {entityType === "location" && (
                      <ItemDescription className="text-xs">
                        {entity.address}
                      </ItemDescription>
                    )}
                    {entityType === "movie" && entity.release_date !== null && (
                      // show release year if available
                      <ItemDescription className="text-xs">
                        {entity.release_date.split("-", 1)[0]}
                      </ItemDescription>
                    )}
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

function titleCase(s: string) {
  const first = s.charAt(0);
  return s.replace(first, first.toUpperCase());
}
