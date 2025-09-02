import "@/app/ui/global.css";
import SideBar from "@/app/ui/dashboard/side-bar";
import SideNavBar from "@/app/ui/dashboard/side-nav-bar";

const userId = 1234; // 임시 userId (확인용)

const Layout = ({ children }: { children: React.ReactNode }) => {
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
      <div className="flex-grow p-6 md:p-12">{children}</div>
    </div>
  );
};

export default Layout;
