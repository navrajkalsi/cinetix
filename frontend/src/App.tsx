import { useState } from "react";
import Header, { type View } from "./components/Header";
import List from "./components/List";

export default function App() {
  const [activeView, setView] = useState<View>("Bookings");

  return (
    <main>
      <Header activeView={activeView} changeView={setView} />
      <List />
    </main>
  );
}
