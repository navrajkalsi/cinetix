import "./Nav.css";

// possible filters union
export const FILTERS = ["Movie", "Format", "Location"] as const;
export type filters = (typeof FILTERS)[number];

export default function Nav() {
  const viewButtons = FILTERS.map((filter) => (
    <div
      key={filter}
      className={filter === "Movie" ? "button active" : "button"}
    >
      {filter}
    </div>
  ));

  return <div id="nav">{viewButtons}</div>;
}
