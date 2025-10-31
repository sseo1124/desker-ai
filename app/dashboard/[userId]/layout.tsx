import { SidebarProvider } from "@/components/ui/sidebar";
import SideBarShell from "@/app/ui/dashboard/side-bar-shell";

type LayoutProps = {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
};

const Layout = async ({ params, children }: LayoutProps) => {
  const { userId } = await params;

  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ "--sidebar-width": "4.5rem" } as React.CSSProperties}
    >
      <SideBarShell userId={userId}>{children}</SideBarShell>
    </SidebarProvider>
  );
};

export default Layout;
