import "@/app/ui/global.css";
import SideBar from "@/app/ui/dashboard/side-bar";
import SideNavBar from "@/app/ui/dashboard/side-nav-bar";

type LayoutProps = {
  params: { userId: string; sessionId: string };
  children: React.ReactNode;
};

const Layout = ({ params, children }: LayoutProps) => {
  const { userId } = params;
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div className="flex h-full">
        <div className="w-28 flex-none">
          <SideBar userId={userId} />
        </div>
        <div className="w-64 flex-none border-l border-brown-200">
          <SideNavBar userId={userId} />
        </div>
      </div>
      <div className="flex-grow p-4 md:p-5">{children}</div>
    </div>
  );
};

export default Layout;
