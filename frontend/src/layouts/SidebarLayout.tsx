import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Backdrop from "@/components/Backdrop";
import FiltersSidebar from "@/components/FiltersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useMatch } from "react-router";

const queryClient = new QueryClient();

export default function FiltersLayout() {
  // show sidebar by default only for the first bookings page
  const bookings = useMatch("/bookings");
  const movies = useMatch("/movies");
  const locations = useMatch("/locations");
  const formats = useMatch("/formats");

  const current =
    (!!bookings && "Bookings") ||
    (!!movies && "Movies") ||
    (!!locations && "Locations") ||
    (!!formats && "Formats") ||
    undefined;

  // remount the sidebar to collapse it when visiting other pages
  return (
    <div className="size-full max-w-full max-h-full flex">
      <QueryClientProvider client={queryClient}>
        <SidebarProvider
          defaultOpen={!!bookings}
          key={bookings ? " bookings" : "other"}
        >
          <FiltersSidebar current={current} />
          <Outlet />
          <Backdrop />
        </SidebarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}
