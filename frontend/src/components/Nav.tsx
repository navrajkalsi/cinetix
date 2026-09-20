import "./Nav.css";

// possible active views union
export const VIEWS = ["Bookings", "Movies", "Locations", "Formats"] as const;
export type View = (typeof VIEWS)[number];

export default function Nav({
  activeView,
  changeView,
}: {
  activeView: View;
  changeView: (view: View) => void;
}) {
  const viewButtons = VIEWS.map((view) => (
    <button
      key={view}
      onClick={() => changeView(view)}
      id={view === activeView ? "active" : ""}
    >
      {view}
    </button>
  ));

  return <nav>{viewButtons}</nav>;
}
