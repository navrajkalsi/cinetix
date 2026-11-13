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
  CircleUserIcon,
  ClapperboardIcon,
  FileVideoCameraIcon,
  FilmIcon,
  MapPinIcon,
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
];

export default function FiltersSidebar() {
  const [movies, locations, formats] = useLookupArrays();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const filters = useLoaderFilters();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip="Toggle Sidebar">
              <SidebarIcon />
              <span>Collapse Sidebar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {pagesGroup}
        <SidebarSeparator className="bg-muted-foreground h-0.5 rounded-full" />
        {filtersGroup(movies, locations, formats, filters, navigate)}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
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
  );
}

const pagesGroup = (
  <SidebarGroup>
    <SidebarGroupLabel>Pages</SidebarGroupLabel>
    <SidebarMenu>
      {pages.map((page) => (
        <SidebarMenuItem key={page.title}>
          <SidebarMenuButton tooltip={page.title}>
            <page.icon />
            <span>{page.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);

// is hidden when the sidebar is collapsed
// TODO make visible when at least one filter is active
// and add a superscript with the total number of filters applied
function filtersGroup(
  movies: Movie[],
  locations: Location[],
  formats: Format[],
  filters: LoaderData["filters"],
  navigate: NavigateFunction,
) {
  if (!filters) return <></>;

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

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Filters</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="movie" className="flex flex-col gap-2.5">
          {"year" in filters && (
            <FiltersYearInput
              value={filters.year}
              onValueChange={(e) => applyFiler({ year: e }, navigate)}
            />
          )}

          {"movieId" in filters && (
            <FiltersCombobox
              entity={["movie", movies]}
              value={movie}
              onValueChange={(e) => applyFiler({ movieId: e?.id }, navigate)}
            />
          )}

          {"locationId" in filters && (
            <FiltersCombobox
              entity={["location", locations]}
              value={location}
              onValueChange={(e) => applyFiler({ locationId: e?.id }, navigate)}
            />
          )}

          {"formatId" in filters && <FiltersSelect formats={formats} />}
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
