import { useState } from "react";
import Nav, { type View } from "./components/Nav";
import List from "./components/List";
import "./App.css";

export default function App() {
  const [activeView, setView] = useState<View>("Bookings");

  return (
    <main>
      <List />
      <Nav activeView={activeView} changeView={setView} />
    </main>
  );
}
