import "./Nav.css";

// possible filters union
export const FILTERS = ["Movie", "Format", "Location"] as const;
export type filters = (typeof FILTERS)[number];

export default function Nav() {
  const viewButtons = FILTERS.map((filter) => (
    <button key={filter} className={filter === "Movie" ? "active" : ""}>
      {filter}
    </button>
  ));

  return <nav>{viewButtons}</nav>;
}
