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
        {filtersGroup(movies, locations, formats, filters)}
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
          {"year" in filters && <FiltersYearInput />}

          {"movieId" in filters && (
            <FiltersCombobox
              entity={["movie", movies]}
              value={movie}
              onValueChange={console.log}
            />
          )}

          {"locationId" in filters && (
            <FiltersCombobox
              entity={["location", locations]}
              value={location}
              onValueChange={console.log}
            />
          )}

          {"formatId" in filters && <FiltersSelect formats={formats} />}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
