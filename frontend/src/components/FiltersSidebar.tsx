import { type Filters } from "@/layouts/FilterLayout";
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
  SidebarTrigger,
} from "./ui/sidebar";
import {
  CircleUserIcon,
  ClapperboardIcon,
  FileVideoCameraIcon,
  FilmIcon,
  MapPinIcon,
} from "lucide-react";
import LookupCombobox, { type Entity } from "./LookupCombobox";
import useLookupArrays from "@/hooks/useLookupArrays";

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

const filters = [
  { title: "Movie", input: LookupCombobox },
  // { title: "Location", input: Combobox },
  // { title: "Format", input: Select },
];

interface Props {
  activeFilters: Filters;
  setActiveFilters: (filters: Filters) => void;
}

export default function FiltersSidebar({
  activeFilters,
  setActiveFilters,
}: Props) {
  const [movies, locations, formats] = useLookupArrays();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger variant="outline" className="mx-auto" />
      </SidebarHeader>

      <SidebarContent>
        {pagesGroup}
        {filtersGroup(["movie", movies])}
      </SidebarContent>

      <SidebarFooter>
        <CircleUserIcon className="mx-auto" />
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
          <SidebarMenuButton>
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
function filtersGroup(entity: Entity) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Filters</SidebarGroupLabel>
      <SidebarMenu>
        {filters.map((filter) => (
          <SidebarMenuItem key={filter.title}>
            <filter.input entity={entity} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
