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
import { MessageCircleMore, ContactRound, Bot, UserCog } from "lucide-react";

const Layout = async () => {
  const items = [
    {
      title: "MessageCircleMore",
      url: `/dashboard/${userId}/invoices/sessions`,
      icon: MessageCircleMore,
      text: "대화 목록",
    },
    {
      title: "ContactRound",
      url: `/dashboard/${userId}/invoices/inquiries`,
      icon: ContactRound,
      text: "방문자 연락처",
    },
    {
      title: "Bot",
      url: `/dashboard/${userId}/chatbot/setting`,
      icon: Bot,
      text: "AI 설정",
    },
    {
      title: "UserCog",
      url: `/dashboard/${userId}/user/setting`,
      icon: UserCog,
      text: "개인 설정",
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
      <Sidebar className="border-r border-borderdestructive-foreground">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-8 pt-swbu9">
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className="flex justify-center"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-8 w-8 text-sidebar-foreground" />
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default Layout;
