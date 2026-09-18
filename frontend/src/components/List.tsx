import { useRef } from "react";
import "./List.css";

export default function List() {
  const list = useRef<HTMLUListElement>(null);

  function handleScroll(e: React.WheelEvent<HTMLElement>) {
    if (list.current == null) {
      return;
    }

    const currentOffset = parseInt(list.current.style.left, 10),
      // clamped to bounds
      newOffset = Math.max(
        Math.min(
          (isNaN(currentOffset) ? 0 : currentOffset) - e.deltaY - e.deltaX,
          0,
        ),
        window.innerWidth - list.current.scrollWidth,
      );

    list.current.style.setProperty("left", `${newOffset}px`);
  }

  return (
    <section onWheel={handleScroll}>
      <ul ref={list}>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
        <li>Fourth</li>
      </ul>
    </section>
  );
}
