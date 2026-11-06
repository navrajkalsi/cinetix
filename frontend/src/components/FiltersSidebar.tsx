import { useFilters } from "@/layouts/FilterLayout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

export default function FiltersSidebar() {
  const filters = useFilters();

  const sidebar = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader />
      <SidebarInset>
        <SidebarContent>
          <SidebarTrigger />
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
      </SidebarInset>
      <SidebarFooter />
    </Sidebar>
  );
}
