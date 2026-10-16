// A dropdown select menu.
// The first of the supplied `options` is selected by default.

import { useState } from "react";
import Input from "./Input";
import "./Select.css";

interface SelectProps {
  entity: string; // type of a single option
  options: Set<string>; // all the options to list
  updateSelected: (option: string) => void; // update parent state
}

export default function Select({
  entity,
  options,
  updateSelected,
}: SelectProps) {
  const optionsArr = Array.from(options);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(optionsArr[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // click or enter handler on a option
  function handleSelect(option: string) {
    setActive(false);
    setSelected(option);
    updateSelected(option);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Esc":
      case "Escape":
        setActive(false);
        break;

      case "Enter":
        // selected is already set with arrows and click
        setActive(false);
        e.preventDefault();
        break;

      case "ArrowUp":
        const up = Math.max(selectedIndex - 1, 0);
        setSelectedIndex(up);
        setSelected(optionsArr[up]);
        updateSelected(optionsArr[up]);
        e.preventDefault();
        break;

      case "ArrowDown":
        const down = Math.min(selectedIndex + 1, optionsArr.length - 1);
        setSelectedIndex(down);
        setSelected(optionsArr[down]);
        updateSelected(optionsArr[down]);
        e.preventDefault();
        break;
    }
  }

  return (
    <div className="select">
      <Input
        placeholder={entity}
        required
        value={selected}
        onClick={() => setActive(true)}
        onBlur={() => setActive(false)}
        onKeyDown={handleKeyDown}
        readOnly
      />

      <div
        className={active ? "options-container" : "options-container hidden"}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <div className="options">
          {optionsArr.map((option, index) => (
            <div
              className={
                index === selectedIndex ? "option highlight" : "option"
              }
              key={index}
              onClick={() => {
                handleSelect(option);
                setSelectedIndex(index);
                setActive(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
