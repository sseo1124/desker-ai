"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNavBar = ({ userId }: { userId: number }) => {
  const pathname = usePathname();

  let sectionTitle = "";
  let menuList: { title: string; href: string }[] = [];

  if (pathname.indexOf(`/dashboard/${userId}/invoices`) !== -1) {
    sectionTitle = "수신함";
    menuList = [
      {
        title: "대화 목록",
        href: `/dashboard/${userId}/invoices/chatroom-sessions`,
      },
      {
        title: "방문자 연락처",
        href: `/dashboard/${userId}/invoices/inquiries`,
      },
    ];
  }

  if (pathname.indexOf(`/dashboard/${userId}/chatbot`) !== -1) {
    sectionTitle = "AI";
    menuList = [
      {
        title: "설정",
        href: `/dashboard/${userId}/chatbot/setting`,
      },
      {
        title: "통계",
        href: `/dashboard/${userId}/chatbot/statistics`,
      },
    ];
  }

  return (
    <div className="flex h-full flex-col px-3 py-4">
      <div className="h-auto w-full grow rounded-md bg-brown-100">
        <div className="flex justify-center items-center h-20 w-full border-b border-brown-300">
          <p className="text-xl font-bold text-brown-600">{sectionTitle}</p>
        </div>
        <div className="p-3 space-y-2">
          {menuList.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-center rounded-md bg-white p-3 text-sm hover:bg-brown-200"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
