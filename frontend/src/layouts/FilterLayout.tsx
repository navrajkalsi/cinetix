import FiltersSidebar from "@/components/FiltersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Format } from "@/models/Format";
import type { Location } from "@/models/Location";
import type { Movie } from "@/models/Movie";
import { useState } from "react";
import { Outlet, useOutletContext } from "react-router";

// Filters that child elements can read to modify the information they are showing
export interface Filters {
  movie?: Movie;
  location?: Location;
  format?: Format;
  year?: number;
}

export default function FiltersLayout() {
  const [filters, setFilters] = useState<Filters>({});

  return (
    <div className="size-full max-w-full max-h-full flex">
      <SidebarProvider defaultOpen={false}>
        <FiltersSidebar activeFilters={filters} setActiveFilters={setFilters} />
        <Outlet context={filters} />
      </SidebarProvider>
    </div>
  );
}

export function useFilters() {
  // taken from https://reactrouter.com/api/hooks/useOutletContext
  return useOutletContext<Filters>();
}
