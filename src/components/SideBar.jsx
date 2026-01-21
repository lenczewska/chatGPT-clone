import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  DollarSign,
  Users,
  Plus,
  Image,
  PanelLeft,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";
import gpt_logo from "../../public/gpt_logo.png";
import gpt_logo_white from "../../public/gpt_logo_white.png";

export default function AppSidebar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);
  const { toggleSidebar, state } = useSidebar();

  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      const body = document.body;
      const parentDiv = document.querySelector(".dark");

      const hasDark =
        root.classList.contains("dark") ||
        body.classList.contains("dark") ||
        parentDiv !== null;

      setIsDark(hasDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const handleNewChat = () => {
    console.log("Создать новый чат");
  };

  const handleSearchChats = () => {
    console.log("Поиск по истории чатов");
  };

  const handleImages = () => {
    console.log("Открыть изображения");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-4">
          <Link to="/" className="group-data-[collapsible=icon]:hidden">
            <img
              src={isDark ? gpt_logo_white : gpt_logo}
              alt="Logo"
              className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors ml-auto"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4 text-sidebar-foreground" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleNewChat} tooltip="Новый чат">
                  <Plus />
                  <span>Новый чат</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSearchChats}
                  tooltip="Поиск в чатах"
                >
                  <Search />
                  <span>Поиск в чатах</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleImages}
                  isActive={location.pathname === "/image"}
                  tooltip="Изображения"
                >
                  <Image />
                  <span>Изображения</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/credits"}
                  tooltip="Credits"
                >
                  <Link to="/credits">
                    <DollarSign />
                    <span>Credits</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/community"}
                  tooltip="Community"
                >
                  <Link to="/community">
                    <Users />
                    <span>Community</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-sidebar-foreground/50 px-2 group-data-[collapsible=icon]:hidden">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
