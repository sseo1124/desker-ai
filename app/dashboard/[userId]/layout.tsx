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
import {
  SIDE_BAR_TOOLTIP_MESSAGE,
  HEADER_BAR_DEATAIL_MESSAGE,
} from "@/config/constants";
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
      headerBarDetailText: HEADER_BAR_DEATAIL_MESSAGE.SESSIONS_LIST,
    },
    {
      title: "ContactRound",
      url: `/dashboard/${userId}/invoices/inquiries`,
      icon: ContactRound,
      text: SIDE_BAR_TOOLTIP_MESSAGE.VISITOR_CONTACT,
      headerBarDetailText: HEADER_BAR_DEATAIL_MESSAGE.VISITOR_CONTACT,
    },
    {
      title: "Bot",
      url: `/dashboard/${userId}/chatbot/setting`,
      icon: Bot,
      text: SIDE_BAR_TOOLTIP_MESSAGE.AI_SETTING,
      headerBarDetailText: HEADER_BAR_DEATAIL_MESSAGE.AI_SETTING,
    },
    {
      title: "UserCog",
      url: `/dashboard/${userId}/user/setting`,
      icon: UserCog,
      text: SIDE_BAR_TOOLTIP_MESSAGE.PERSONAL_SETTINGS,
      headerBarDetailText: HEADER_BAR_DEATAIL_MESSAGE.PERSONAL_SETTINGS,
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
      <div className="flex h-screen w-full">
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
