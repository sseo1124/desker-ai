import Link from "next/link";
import LogoImage from "./logo-image";
import SideLinks from "./side-links";
import { PowerIcon } from "@heroicons/react/24/outline";

const SideBar = ({ userId }: { userId: number }) => {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <Link
        className="flex mb-4 items-start justify-center rounded-md p-2"
        href="/"
      >
        <div className="w-24">
          <LogoImage />
        </div>
      </Link>
      <div className="flex grow flex-col justify-between space-y-2">
        <div className="h-auto w-full grow rounded-md">
          <SideLinks userId={userId} />
        </div>
        <div>
          <button
            type="button"
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-brown-200 p-3 text-sm font-medium hover:bg-brown-800 hover:text-white"
          >
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
