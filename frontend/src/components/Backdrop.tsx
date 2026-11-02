import {
  ApertureIcon,
  ClapperboardIcon,
  Disc3Icon,
  FilmIcon,
  MonitorPlayIcon,
  PopcornIcon,
  ProjectorIcon,
  TvIcon,
  VideoIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";

// const EmojiCollection = ["🎥", "🍿", "📽️", "🎞️", "🎦", "🎬"] as const;
const IconCollection = [
  ProjectorIcon,
  PopcornIcon,
  FilmIcon,
  ClapperboardIcon,
  VideoIcon,
  TvIcon,
  ApertureIcon,
  MonitorPlayIcon,
  Disc3Icon,
] as const;

const TextCollection = [
  "IMAX",
  "IMAX 70mm",
  "70mm",
  "Dolby",
  "4K",
  "24 FPS",
  "23.98 FPS",
  "HFR",
  "Nolan",
  "Villeneuve",
  "Tarantino",
  "Dune",
  "Dark Knight",
  "Why so serious?",
  "Cineplex",
  "No Spoiler!",
  "Coming Soon",
  "Oppenheimer",
  "Interstellar",
  "The Odyssey",
  "Say what again!",
] as const;

type IconCollectionType = (typeof IconCollection)[number];
type TextCollectionType = (typeof TextCollection)[number];

interface Config {
  pos: [number, number];
  rotate: number;
  opacity: number;
}

// timeout for appearing new items at mount and changing state in ms
const MaxTimeout = 50000;

const ItemsCount = 25;

export default function Backdrop() {
  const [refresh, setRefresh] = useState(0);
  const iconItems = useMemo(
    () => Array.from({ length: ItemsCount }).map((_, i) => randomIconItem(i)),
    [],
  );
  const textItems = useMemo(
    () => Array.from({ length: ItemsCount }).map((_, i) => randomTextItem(i)),
    [],
  );

  const refreshItems = useCallback(() => {
    iconItems.forEach((_, i) => {
      const config = randomConfig();
      const item = document.getElementById(`icon-item-${i}`);
      if (!item) return;

      item.style.left = config.pos[0] + "px";
      item.style.top = config.pos[1] + "px";
      item.style.rotate = config.rotate + "deg";
      item.style.opacity = config.opacity.toString();
    });

    textItems.forEach((_, i) => {
      const config = randomConfig();
      const item = document.getElementById(`text-item-${i}`);
      if (!item) return;

      item.style.left = config.pos[0] + "px";
      item.style.top = config.pos[1] + "px";
      item.style.opacity = config.opacity.toString();
    });
  }, [iconItems, textItems]);

  useEffect(() => {
    refreshItems();
    const timer = setTimeout(() => setRefresh((i) => ++i), MaxTimeout);

    return () => clearTimeout(timer);
  }, [refresh, refreshItems]);

  return (
    <div className="fixed top-0 left-0 size-full -z-10 text-white motion-reduce:hidden">
      {iconItems.map((item, index) => (
        <Fragment key={index}>{item}</Fragment>
      ))}
      {textItems.map((item, index) => (
        <Fragment key={index}>{item}</Fragment>
      ))}
    </div>
  );
}

// returns a random positin anywhere within window viewport
function randomPos(): [number, number] {
  return [
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
  ];
}

function randomIcon(): IconCollectionType {
  return IconCollection[Math.floor(Math.random() * IconCollection.length)];
}

function randomText(): TextCollectionType {
  return TextCollection[Math.floor(Math.random() * TextCollection.length)];
}

function randomRotation() {
  return Math.random() * 360;
}

function randomOpacity() {
  // clamp to middle half
  return Math.random() * 0.5 + 0.25;
}

function randomConfig(): Config {
  return {
    pos: randomPos(),
    rotate: randomRotation(),
    opacity: randomOpacity(),
  };
}

function randomIconItem(id: number) {
  const pos = randomPos();
  const rotation = randomRotation();
  const Icon = randomIcon();

  return (
    <div
      id={`icon-item-${id}`}
      className="opacity-50 size-fit absolute origin-center ease-linear duration-50000 text-2xl"
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`,
        rotate: `${rotation}deg`,
      }}
    >
      <Icon />
    </div>
  );
}

function randomTextItem(id: number) {
  const pos = randomPos();

  return (
    <div
      id={`text-item-${id}`}
      className="opacity-50 size-fit absolute origin-center ease-linear duration-50000 font-heading text-sm text-shadow-white"
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`,
      }}
    >
      {randomText()}
    </div>
  );
}
