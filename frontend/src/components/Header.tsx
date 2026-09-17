import "./Header.css";

// possible active views union
export const VIEWS = ["Bookings", "Movies", "Locations", "Formats"] as const;
export type View = (typeof VIEWS)[number];

export default function Header({
  activeView,
  changeView,
}: {
  activeView: View;
  changeView: React.Dispatch<React.SetStateAction<View>>;
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

  return (
    <header>
      <nav>{viewButtons}</nav>
    </header>
  );
}
