import { useState } from "react";
import Nav, { type View } from "./components/Nav";
import List from "./components/List";
import "./App.css";
import items from "./../demo.json";
import type Booking from "./models/Booking";

export default function App() {
  const [activeView, setView] = useState<View>("Bookings");

  const bookings: Array<Booking> = items;

  return (
    <main>
      <List items={bookings} />
      <Nav activeView={activeView} changeView={setView} />
    </main>
  );
}
