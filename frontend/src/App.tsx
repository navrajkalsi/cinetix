import { useEffect, useState } from "react";
import Nav, { type View } from "./components/Nav";
import List from "./components/List";
import "./App.css";
import type Booking from "./models/Booking";
import { getBookings } from "./api/booking";
import type Movie from "./models/Movie";
import type Location from "./models/Location";
import type Format from "./models/Format";
import { getMovies } from "./api/movie";
import { getLocations } from "./api/location";
import { getFormats } from "./api/format";

export default function App() {
  const [data, setData] = useState<Data | null>(null);

  function changeView(view: View) {
    switch (view) {
      case "Bookings":
        getBookings()
          .then((bookings) => setData({ view: "Bookings", items: bookings }))
          .catch(console.error);
        break;
      case "Movies":
        getMovies()
          .then((movies) => setData({ view: "Movies", items: movies }))
          .catch(console.error);
        break;
      case "Locations":
        getLocations()
          .then((locations) => setData({ view: "Locations", items: locations }))
          .catch(console.error);
        break;
      case "Formats":
        getFormats()
          .then((formats) => setData({ view: "Formats", items: formats }))
          .catch(console.error);
        break;
    }
  }

  useEffect(() => changeView("Bookings"), []);

  return data === null ? (
    <main id="loading">Loading</main>
  ) : (
    <main>
      <List data={data} />
      <Nav activeView={data.view} changeView={changeView} />
    </main>
  );
}

export type Data =
  | { view: "Bookings"; items: Booking[] }
  | { view: "Movies"; items: Movie[] }
  | { view: "Locations"; items: Location[] }
  | { view: "Formats"; items: Format[] };
