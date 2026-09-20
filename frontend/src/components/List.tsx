import { useEffect, useRef } from "react";
import "./List.css";
import { type Data } from "../App.tsx";
import Booking from "./Booking";
import Movie from "./Movie";
import Location from "./Location";
import Format from "./Format";

interface ScrollOffsets {
  bookings: number;
  movies: number;
  locations: number;
  formats: number;
}

export default function List({ data }: { data: Data }) {
  const list = useRef<HTMLUListElement>(null);
  const scrollOffsets = useRef<ScrollOffsets>({
    bookings: 0,
    movies: 0,
    locations: 0,
    formats: 0,
  });

  function getCurrentScrollOffset(data: Data): number {
    if (list.current === null) {
      return 0;
    }

    switch (data.view) {
      case "Bookings":
        return scrollOffsets.current.bookings;
      case "Movies":
        return scrollOffsets.current.movies;
      case "Locations":
        return scrollOffsets.current.locations;
      case "Formats":
        return scrollOffsets.current.formats;
    }
  }

  function updateScrollOffets(offset: number) {
    if (list.current === null) {
      return;
    }

    switch (data.view) {
      case "Bookings":
        scrollOffsets.current.bookings = offset;
        break;
      case "Movies":
        scrollOffsets.current.movies = offset;
        break;
      case "Locations":
        scrollOffsets.current.locations = offset;
        break;
      case "Formats":
        scrollOffsets.current.formats = offset;
        break;
    }
  }

  function handleScroll(e: React.WheelEvent<HTMLElement>) {
    if (list.current == null) {
      return;
    }

    const currentOffset = getCurrentScrollOffset(data),
      // clamped to bounds
      newOffset = Math.max(
        Math.min(
          (isNaN(currentOffset) ? 0 : currentOffset) - e.deltaY - e.deltaX,
          0,
        ),
        window.innerWidth > list.current.scrollWidth
          ? 0
          : window.innerWidth - list.current.scrollWidth,
      );

    list.current.style.setProperty("left", `${newOffset}px`);
    updateScrollOffets(newOffset);
  }

  useEffect(() => {
    if (list.current === null) {
      return;
    }

    list.current.style.setProperty("left", `${getCurrentScrollOffset(data)}px`);
  }, [data]);

  const listItems = (() => {
    switch (data.view) {
      case "Bookings":
        return data.items.map((item) => (
          <li key={item.id}>
            <Booking booking={item} />
          </li>
        ));
      case "Movies":
        return data.items.map((item) => (
          <li key={item.id}>
            <Movie movie={item} />
          </li>
        ));
      case "Locations":
        return data.items.map((item) => (
          <li key={item.id}>
            <Location location={item} />
          </li>
        ));
      case "Formats":
        return data.items.map((item) => (
          <li key={item.id}>
            <Format format={item} />
          </li>
        ));
    }
  })();

  return (
    <section onWheel={handleScroll}>
      <ul ref={list}>{listItems}</ul>
    </section>
  );
}
