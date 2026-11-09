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
import { Input } from "./ui/input";
import { useMatches } from "react-router";
import type { Filter } from "@/filters";

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

  const match = useMatches().at(-1);
  const filters = match ? (match.handle as Filter[]) : [];

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
        {filtersGroup(movies, locations, formats)}
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
) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Filters</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="movie" className="flex flex-col gap-2.5">
          <FiltersCombobox entity={["movie", movies]} />
          <FiltersCombobox entity={["location", locations]} />
          <FiltersSelect formats={formats} />
          <Input
            type="number"
            placeholder="Year"
            step="1"
            min="2000"
            max="2030"
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
