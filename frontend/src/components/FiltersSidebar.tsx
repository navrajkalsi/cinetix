import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import {
  ChartSplineIcon,
  CircleUserIcon,
  ClapperboardIcon,
  FileVideoCameraIcon,
  FilmIcon,
  FunnelIcon,
  MapPinIcon,
  PlusIcon,
  SidebarIcon,
} from "lucide-react";
import useLookupArrays from "@/hooks/useLookupArrays";
import type { Movie } from "@/models/Movie";
import type { Location } from "@/models/Location";
import FiltersCombobox from "./FiltersCombobox";
import type { Format } from "@/models/Format";
import FiltersSelect from "./FiltersSelect";
import FiltersYearInput from "./FiltersYearInput";
import { useLoaderFilters, type LoaderData } from "@/loaders";
import type { Filters, Filter } from "@/filters";
import { useNavigate, type NavigateFunction } from "react-router";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import Stats from "./Stats";

const pages = [
  {
    title: "Bookings",
    link: "/bookings",
    icon: FileVideoCameraIcon,
  },
  {
    title: "Movies",
    link: "/movies",
    icon: ClapperboardIcon,
  },
  {
    title: "Locations",
    link: "/locations",
    icon: MapPinIcon,
  },
  {
    title: "Formats",
    link: "/formats",
    icon: FilmIcon,
  },
] as const;

interface Props {
  current?: "Bookings" | "Movies" | "Locations" | "Formats";
}

export default function FiltersSidebar({ current }: Props) {
  const [movies, locations, formats] = useLookupArrays();
  const { open, setOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [statsOpen, setStatsOpen] = useState(false);

  const filters = useLoaderFilters();

  return (
    <>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                tooltip="Toggle Sidebar"
              >
                <SidebarIcon />
                <span>Collapse Sidebar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="gap-5">
          {pagesGroup(navigate, current)}
          <SidebarSeparator className="bg-muted-foreground h-0.5 rounded-full" />
          {filtersGroup(
            movies,
            locations,
            formats,
            filters,
            navigate,
            open,
            setOpen,
          )}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {current === "Bookings" && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Create new booking"
                    onClick={() => navigate("/bookings/new")}
                  >
                    <PlusIcon />
                    <span>Add Booking</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={`Stats for ${filters && "year" in filters && filters.year ? filters.year : "all years"}`}
                    onClick={() => setStatsOpen(true)}
                  >
                    <ChartSplineIcon />
                    <span>Stats</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton>
                <CircleUserIcon />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent
          className="flex items-center justify-center w-1/2 h-3/5 sm:max-w-full bg-transparent"
          showCloseButton={false}
        >
          <Stats />
        </DialogContent>
      </Dialog>
    </>
  );
}

function pagesGroup(navigate: NavigateFunction, current: Props["current"]) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu className="gap-2.5">
        {pages.map((page) => (
          <SidebarMenuItem key={page.title}>
            <SidebarMenuButton
              tooltip={page.title}
              isActive={current === page.title}
              onClick={() => navigate(page.link)}
            >
              <page.icon />
              <span>{page.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// is hidden when the sidebar is collapsed
// TODO make visible when at least one filter is active
// and add a superscript with the total number of filters applied
function filtersGroup(
  movies: Movie[],
  locations: Location[],
  formats: Format[],
  filters: LoaderData["filters"],
  navigate: NavigateFunction,
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  if (!filters) return <></>;

  const year = "year" in filters ? (filters.year ?? null) : null;
  const movie =
    "movieId" in filters
      ? (movies.find((m) => m.id === filters.movieId) ?? null)
      : null;
  const location =
    "locationId" in filters
      ? (locations.find((l) => l.id === filters.locationId) ?? null)
      : null;
  const format =
    "formatId" in filters
      ? (formats.find((f) => f.id === filters.formatId) ?? null)
      : null;

  const activeCount =
    (year ? 1 : 0) + (movie ? 1 : 0) + (location ? 1 : 0) + (format ? 1 : 0);

  if (!open && activeCount)
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive onClick={() => setOpen(true)}>
              <FunnelIcon />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex gap-2.5">
        Filters
        {activeCount > 0 && (
          <span className="bg-foreground rounded-full aspect-square h-5 w-auto text-[1.2em] font-bold font-heading text-background flex justify-center items-center">
            {activeCount}
          </span>
        )}
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-2.5">
          {"year" in filters && (
            <FiltersYearInput
              value={year}
              onValueChange={(e) =>
                applyFiler({ year: e ?? undefined }, navigate)
              }
            />
          )}

          {"movieId" in filters && (
            <FiltersCombobox
              entity={["movie", movies]}
              value={movie}
              onValueChange={(m) => applyFiler({ movieId: m?.id }, navigate)}
            />
          )}

          {"locationId" in filters && (
            <FiltersCombobox
              entity={["location", locations]}
              value={location}
              onValueChange={(l) => applyFiler({ locationId: l?.id }, navigate)}
            />
          )}

          {"formatId" in filters && (
            <FiltersSelect
              formats={formats}
              value={format}
              onValueChange={(f) => applyFiler({ formatId: f?.id }, navigate)}
            />
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

// navigates to the new query(search) string, preserving original params and overwriting supplied filters
function applyFiler(filters: Partial<Filters>, navigate: NavigateFunction) {
  const params = new URLSearchParams(location.search);

  const setOrDelete = (key: Filter, n?: number) =>
    n ? params.set(key, n.toString()) : params.delete(key);

  if ("year" in filters) setOrDelete("year", filters.year);
  if ("movieId" in filters) setOrDelete("movieId", filters.movieId);
  if ("locationId" in filters) setOrDelete("locationId", filters.locationId);
  if ("formatId" in filters) setOrDelete("formatId", filters.formatId);

  navigate(
    {
      search: params.toString(),
    },
    { replace: true },
  ); // do not add history record
}
