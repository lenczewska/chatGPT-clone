import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Image, PanelLeft, Search } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useAppContext } from "@/context/AppContext";

import SearchModal from "../components/SearchModal.jsx";
import useHotKeys from "./hooks/useHotKeys";
import gpt_logo from "../../public/gpt_logo.png";
import gpt_logo_white from "../../public/gpt_logo_white.png";

const SideBar = () => {
  const { chats } = useAppContext();
  const [search] = useState("");
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);
  const { toggleSidebar, state } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const handleSearchModal = (value) => {
    console.log(value);
  };

  useHotKeys([
    {
      keys: { ctrl: true, shift: false, alt: false, key: "k" },
      callback: () => setIsSearchOpen(true),
    },
    {
      keys: { ctrl: true, shift: true, alt: false, key: "o" },
      callback: () => setIsOutlineOpen(true),
    },
  ]);

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

  const handleImages = () => {
    console.log("Открыть изображения");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="group-data-[collapsible=icon]:hidden">
            <img
              src={gpt_logo}
              alt="Logo"
              className="h-6 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className=" rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors ml-auto"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {/* chat */}
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton onClick={handleNewChat}>
                        <Plus className="cursor-pointer" />
                        <span className="cursor-pointer">Новый чат</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                    >
                      <p className="text-xs  text-gray-600">Ctrl + Shift + O</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>

              <SidebarMenuItem>
                {/* search */}

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        tooltip="Поиск в чатах"
                      >
                        <Search className="cursor-pointer " value={search} />
                        <span className="cursor-pointer">Поиск в чатах</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                    >
                      <p className="text-xs  text-gray-600">Ctrl + K</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
              <SearchModal
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onSearch={handleSearchModal}
              />

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleImages}
                  isActive={location.pathname === "/image"}
                  tooltip="Изображения"
                >
                  <Image className="cursor-pointer" />
                  <span className="cursor-pointer">Изображения</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="ml-4 mr-4 text-sm text-gray-500 border-t pt-3 ">
                <span>Ваши чаты</span>

        </div>

        {/* chats history */}
        {chats.lenght > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
        <div className="fex-1 overflow-y-scroll mt-3 text-sm space-y-3 ml-2 mr-2 ">
          {chats
            .filter((chat) =>
              chat.messages[0]
                ? chat.messages[0]?.content
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((chat) => (
              <div
                key={chat._id}
                className="p-2  dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group "
              >
                <p className="w-full truncate ">
                  {chat.messages.lenght > 0
                    ? chat.mesages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">{chat.updatedAt}</p>
                <img src={gpt_logo} className="w-2 h-2" alt="" />
              </div>
            ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-sidebar-foreground/50 px-2 group-data-[collapsible=icon]:hidden">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
