import FiltersSidebar from "@/components/FiltersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useMatch } from "react-router";

export default function FiltersLayout() {
  // show sidebar by default only for the first bookings page
  const bookings = useMatch("/bookings");

  // remount the sidebar to collapse it when visiting other pages
  return (
    <div className="size-full max-w-full max-h-full flex">
      <SidebarProvider
        defaultOpen={!!bookings}
        key={bookings ? " bookings" : "other"}
      >
        <FiltersSidebar />
        <Outlet />
      </SidebarProvider>
    </div>
  );
}
