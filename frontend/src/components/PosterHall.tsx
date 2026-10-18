import useLookupArrays from "@/hooks/useLookupArrays";
import { Marquee } from "./ui/marquee";
import { useEffect, useMemo, useState } from "react";

const postersPerColumn = 5;

function shuffle<T>(arr: T[]): T[] {
  const indices = Array.from(Array(arr.length).keys());

  // active view in the indices array to pick the next index from
  let viewLen = arr.length;
  const ret: T[] = [];

  while (viewLen > 0) {
    // index of the number to target in indices
    // that number will then be the index to remove from arr
    const indicesIndex = Math.floor(Math.random() * viewLen);

    // index to remove from arr
    const arrIndex = indices[indicesIndex];

    ret.push(arr[arrIndex]);

    indices[indicesIndex] = indices[--viewLen];
    indices[viewLen] = arrIndex;
  }

  return ret;
}

// returns 2/3 aspect ratio card
// fetches 342px wide version of posters
function PosterCard({ posterPath }: { posterPath: string | null }) {
  const [error, setError] = useState(posterPath === null || posterPath === "");

  return (
    <div
      className="aspect-2/3 w-full h-auto overflow-hidden rounded-xl opacity-50 hover:opacity-90 duration-300 ease-in-out
        bg-gray-950/1 hover:bg-gray-950/5
        dark:bg-gray-50/10 dark:hover:bg-gray-50/15
    "
    >
      {
        // only show the image on no error
        !error && (
          <img
            aria-hidden
            alt=""
            className="w-full h-full object-cover"
            src={`https://image.tmdb.org/t/p/w342${posterPath}`}
            loading="lazy"
            decoding="async"
            onError={() => setError(true)}
          />
        )
      }
    </div>
  );
}

// A netflix style movie posters scrolling vertically for background
export default function PosterHall() {
  const [portrait, setPortrait] = useState(
    window.innerWidth < window.innerHeight,
  );
  const [movies] = useLookupArrays();

  useEffect(() => {
    const onResize = () => setPortrait(window.innerWidth < window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // show less columns in portrait orientation
  const columnCount = portrait ? 4 : 6;

  const columns = useMemo(() => {
    const paths = shuffle(
      movies.map((m) => m.poster_path).filter((p): p is string => !!p), // is string, narrows the type down and !!p checks for both null and empty
      // movies.map((m) => m.poster_path).filter((p) => p !== null && p !== ""), // easier to understand version
    );

    // create null elements instead
    const nullPath = paths.length === 0;

    const ret: (string | null)[][] = [];
    let current = 0;

    for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < postersPerColumn; j++) {
        if (i >= ret.length) ret.push([]);

        if (nullPath) ret[i].push(null);
        else {
          ret[i].push(paths[current]);
          if (++current >= paths.length) current = 0;
        }
      }
    }

    return ret;
  }, [columnCount, movies]);

  return (
    <div className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden">
      {columns.map((column, i) => (
        <Marquee
          vertical
          reverse={i % 2 === 0}
          key={i}
          className="[--duration:250s] w-full"
        >
          {column.map((path, j) => (
            <PosterCard key={(path ? path : "") + j} posterPath={path} />
          ))}
        </Marquee>
      ))}
      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
    </div>
  );
}
