import FiltersSidebar from "@/components/FiltersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Format } from "@/models/Format";
import type { Location } from "@/models/Location";
import type { Movie } from "@/models/Movie";
import { Outlet } from "react-router";

// Filters that child elements can read to modify the information they are showing
export interface Filters {
  movie?: Movie;
  location?: Location;
  format?: Format;
  year?: number;
}

export default function FiltersLayout() {
  return (
    <div className="size-full max-w-full max-h-full flex">
      <SidebarProvider defaultOpen={false}>
        <FiltersSidebar />
        <Outlet />
      </SidebarProvider>
    </div>
  );
}
