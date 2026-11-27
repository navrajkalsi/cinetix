import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  title: string;
  page: string;
  children?: ReactNode;
}

export default function ListItem({ title, page, children }: Props) {
  return (
    <Link className="size-full" to={page}>
      <div className="flex flex-col justify-evenly items-center gap-4 duration-300 cursor-pointer hover:scale-103">
        <div className="rounded-5xl overflow-hidden aspect-2/3 w-full h-auto bg-background/70 shadow-list-item pointer-events-none flex flex-col justify-center items-center">
          {children}
        </div>
        <span className="font-heading font-bold text-xl text-center">
          {title}
        </span>
      </div>
    </Link>
  );
}
