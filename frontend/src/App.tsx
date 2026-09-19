import { useEffect, useState } from "react";
import Nav, { type View } from "./components/Nav";
import List from "./components/List";
import "./App.css";
import type Booking from "./models/Booking";
import { getBookings } from "./api/bookings";

export default function App() {
  const [activeView, setView] = useState<View>("Bookings");
  const [bookings, setBookings] = useState<Array<Booking>>([]);

  useEffect(() => {
    getBookings().then(setBookings).catch(console.error);
  }, []);

  return (
    <main>
      <List items={bookings} />
      <Nav activeView={activeView} changeView={setView} />
    </main>
  );
}
