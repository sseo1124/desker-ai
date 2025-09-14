"use client";

import "@/app/ui/global.css";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { MessageCircleMore, ContactRound, Bot, UserCog } from "lucide-react";
import { SIDE_BAR_TOOLTIP_MESSAGE } from "@/config/constants";
import DescriptionBar from "@/app/ui/dashboard/description-header-bar";
import { usePathname } from "next/navigation";
import { use } from "react";

type LayoutProps = {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
};

const Layout = ({ params, children }: LayoutProps) => {
  const { userId } = use(params);
  const pathname = usePathname();
  const items = [
    {
      title: "MessageCircleMore",
      url: `/dashboard/${userId}/invoices/sessions`,
      icon: MessageCircleMore,
      text: SIDE_BAR_TOOLTIP_MESSAGE.SESSIONS_LIST,
      headerBarDetailText:
        "방문자와 나눈 모든 대화 세션을 확인할 수 있습니다. 필요한 세션을 선택해 상세 메시지를 열람하세요.",
    },
    {
      title: "ContactRound",
      url: `/dashboard/${userId}/invoices/inquiries`,
      icon: ContactRound,
      text: SIDE_BAR_TOOLTIP_MESSAGE.VISITOR_CONTACT,
      headerBarDetailText:
        "방문자가 남긴 문의와 연락처 정보를 관리할 수 있습니다. 빠른 대응을 위해 연락처 정보를 확인하세요.",
    },
    {
      title: "Bot",
      url: `/dashboard/${userId}/chatbot/setting`,
      icon: Bot,
      text: SIDE_BAR_TOOLTIP_MESSAGE.AI_SETTING,
      headerBarDetailText:
        "AI 챗봇의 관련 설정을 할 수 있습니다. URL을 등록해 챗봇이 최신 정보를 학습하도록 설정해 보세요.",
    },
    {
      title: "UserCog",
      url: `/dashboard/${userId}/user/setting`,
      icon: UserCog,
      text: SIDE_BAR_TOOLTIP_MESSAGE.PERSONAL_SETTINGS,
      headerBarDetailText:
        "계정과 사용자 정보를 관리할 수 있습니다. 개인 설정을 조정하세요.",
    },
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "4.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen">
        <Sidebar className="border-r border-foreground">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-8 pt-9">
                  {items.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      className="flex justify-center"
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={item.url}>
                            <item.icon className="h-8 w-8 text-sidebar-foreground" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={10}>
                          <p className="text-sm">{item.text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          {items
            .filter((item) => pathname.startsWith(item.url))
            .map((item) => (
              <DescriptionBar
                key={item.title}
                icon={item.icon}
                text={item.text}
                headerBarDetailText={item.headerBarDetailText}
              />
            ))}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
