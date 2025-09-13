import "@/app/ui/global.css";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const Layout = async () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "4.5rem",
        } as React.CSSProperties
      }
    >
      <Sidebar className="border-r border-borderdestructive-foreground">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-8 pt-swbu9">
                <SidebarMenuItem className="flex justify-center"></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default Layout;
