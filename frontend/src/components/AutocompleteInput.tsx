import Input from "./Input.tsx";
import "./AutocompleteInput.css";
import type { MovieCreate } from "../models/Movie.ts";
import type { LocationCreate } from "../models/Location.ts";
import { useEffect, useState } from "react";
import Spinner from "./Spinner.tsx";

interface AutocompleteProps<T extends MovieCreate | LocationCreate> {
  name: string;
  databaseRecords: T[];
  externalRecords: T[] | null; // null when no records have been requested
  externalService: string;
  fetchExternal: (searchTerm: string) => void;
  updateSelected: (id: string | number | null) => void; // update selectedid in parent
}

// only for text based inputs
// each input will be required
export default function AutocompleteInput<
  T extends MovieCreate | LocationCreate,
>({
  name,
  databaseRecords,
  externalRecords,
  externalService,
  fetchExternal,
  updateSelected,
}: AutocompleteProps<T>) {
  const [active, setActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // external id of the selected record
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [extRequested, setExtRequested] = useState(false);
  // index of the combined db and ext records
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const dbRecords = databaseRecords.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()),
  ); // filtered db records

  // no need to filter external records as they are already matched by the server

  // max index will be derived from this
  const totalLen = externalRecords
    ? dbRecords.length + externalRecords.length
    : dbRecords.length;

  // fired on every input
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setActive(true);

    if (selectedId !== null) {
      setSelectedId(null); // no external id is selected
      updateSelected(null);
    }

    setSelectedIndex(0); // highlight the first index on change
    setSearchTerm(value);
    if (extRequested && value.length > 0) fetchExternal(value); // no empty fetching
  }

  // click or enter handler on a suggestion
  function handleSelect(record: T) {
    setActive(false);
    setSearchTerm(record.name);
    setSelectedId(record.external_id);
    updateSelected(record.external_id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Esc":
      case "Escape":
        setActive(false);
        break;

      case "Enter":
        // select the highlighted suggestion
        if (
          dbRecords.length === 0 &&
          (externalRecords === null || externalRecords.length === 0)
        )
          setSelectedId(null); // empty suggestions
        else if (dbRecords.length > selectedIndex)
          handleSelect(dbRecords[selectedIndex]);
        else if (externalRecords !== null)
          handleSelect(externalRecords[selectedIndex - dbRecords.length]);

        e.preventDefault();
        break;

      case "ArrowUp":
        setSelectedIndex((i) => Math.max(i - 1, 0));
        e.preventDefault();
        break;

      case "ArrowDown":
        setSelectedIndex((i) => Math.min(i + 1, totalLen - 1));
        e.preventDefault();
        break;
    }
  }

  useEffect(() =>
    document.getElementsByClassName("highlight")[0].scrollIntoView({
      behavior: "smooth",
      block: "center",
    }),
  );

  return (
    <>
      <div className="input-container">
        <Input
          placeholder={name}
          name={name.toLowerCase()}
          required
          value={searchTerm}
          onChange={handleChange}
          onFocusCapture={() => {
            if (searchTerm.length > 0) setActive(true);
          }}
          onBlur={() => setActive(false)}
          onKeyDown={handleKeyDown}
        />

        {selectedId != null && (
          <input
            name={name.toLowerCase() + "_id"}
            value={selectedId}
            readOnly
            hidden
            required
          />
        )}

        <div
          className={active ? "suggestions" : "suggestions hidden"}
          onMouseDown={(e) => e.preventDefault()} // make sure the input does not loose focus when clicking on suggestions
        >
          <div className="database-title">Results from Cinetix:</div>
          <div className="database">
            {dbRecords.map((record, index) => (
              <div
                className={
                  index === selectedIndex
                    ? "suggestion highlight"
                    : "suggestion"
                }
                key={record.external_id}
                onClick={() => handleSelect(record)}
              >
                {record.name}
              </div>
            ))}
          </div>

          {!extRequested && (
            <div
              className="external-loader"
              onClick={() => {
                if (searchTerm.length > 0) {
                  setExtRequested(true);
                  fetchExternal(searchTerm);
                }
              }}
            >
              Load more results from {externalService}.
            </div>
          )}

          {extRequested && externalRecords === null && (
            <div className="loading">
              <Spinner />
            </div>
          )}

          {extRequested && externalRecords !== null && (
            <div className="external-title">
              {externalRecords.length === 0
                ? `No results found from ${externalService}.`
                : `Results from ${externalService}:`}
            </div>
          )}

          {extRequested && externalRecords && externalRecords.length > 0 && (
            <div className="external">
              {externalRecords.map((record, index) => (
                <div
                  className={
                    index === selectedIndex - dbRecords.length
                      ? "suggestion highlight"
                      : "suggestion"
                  }
                  key={record.external_id}
                  onClick={() => handleSelect(record)}
                >
                  {record.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
