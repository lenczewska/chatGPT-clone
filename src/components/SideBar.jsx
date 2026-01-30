import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Image, PanelLeft, Search, TextCursor } from "lucide-react";
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
import { assets } from "@/assets/assets";
import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, theme, setTheme, user, setSelectedChat } = useAppContext();
  const [search] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState(null);

  const handleSearchModal = (value) => {
    console.log(value);
  };

  useHotKeys([
    {
      keys: { ctrl: true, shift: false, alt: false, key: "k" },
      callback: () => setIsSearchOpen(true),
    },
  ]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Before:", {
      theme,
      newTheme,
      hasClass: document.documentElement.classList.contains("dark"),
      allClasses: document.documentElement.className,
    });
    setTheme(newTheme);

    setTimeout(() => {
      console.log("After:", {
        theme: newTheme,
        hasClass: document.documentElement.classList.contains("dark"),
        allClasses: document.documentElement.className,
      });
    }, 200);
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    console.log("Delete chat:", chatId);
  };

  const formatTime = (date) => {
    if (!date) return "";
    const momentDate = moment(date);
    const now = moment();
    const diffInHours = now.diff(momentDate, "hours");
    const diffInDays = now.diff(momentDate, "days");

    if (diffInHours < 24) {
      return momentDate.fromNow(); 
    } else if (diffInDays < 7) {
      return momentDate.calendar(null, {
        lastDay: "[Вчера]",
        lastWeek: "dddd", 
        sameElse: "DD.MM.YYYY",
      });
    } else {
      return momentDate.format("DD.MM.YYYY");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex items-center justify-between px-4 py-4 ${!isMenuOpen && "max-md:-translate-x-full"}`}
        >
          <Link to="/" className="group-data-[collapsible=icon]:hidden">
            <img
              src={theme === "dark" ? gpt_logo_white : gpt_logo}
              alt="Logo"
              className="h-6 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors ml-auto"
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
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => {
                          navigate("/");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Plus className="cursor-pointer" />
                        <span className="cursor-pointer">Новый чат</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                    >
                      <p className="text-xs text-gray-600">Ctrl + Shift + O</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        tooltip="Поиск в чатах"
                      >
                        <Search className="cursor-pointer" />
                        <span className="cursor-pointer">Поиск в чатах</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                    >
                      <p className="text-xs text-gray-600">Ctrl + K</p>
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
                  onClick={() => {
                    navigate("/community");
                    setIsMenuOpen(false);
                  }}
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

        <div className="ml-4 mr-4 text-sm text-gray-500 border-t pt-3">
          <span>Ваши чаты</span>
        </div>

        {/* chats history */}
        <div className="flex-1 overflow-y-scroll scrollbar-hide mt-3 text-sm space-y-3 ml-2 mr-2">
          {chats
            .filter((chat) => {
              const firstMessage = chat.messages?.[0]?.content;
              return firstMessage
                ? firstMessage.toLowerCase().includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((chat) => {
              const firstMessage = chat.messages?.[0]?.content;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className="p-2 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-[#57317C]/20 transition-colors"
                  onMouseEnter={() => setHoveredChatId(chat._id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  <div className="flex flex-col overflow-hidden flex-1">
                    <p className="truncate font-medium">
                      {firstMessage ? firstMessage.slice(0, 32) : chat.name}
                    </p>

                    <span className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                      {formatTime(chat.updatedAt || chat.createdAt)}
                    </span>
                  </div>

                  {hoveredChatId === chat._id && (
                    <img
                      src={assets.bin_icon}
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="rounded-full bg-gray-400 w-5 h-5 p-1 cursor-pointer dark:invert-0 hover:bg-red-500 transition-colors"
                      alt="Delete chat"
                    />
                  )}
                </div>
              );
            })}
        </div>

        <div className="flex items-center justify-between gap-2 p-3 mt-1 border border-gray-300 dark:border-white/15 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <img src={assets.theme_icon} alt="" />
            <p>Dark Mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              onChange={handleThemeToggle}
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-gray-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        {/* user acc  */}
         <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
          <img src={assets.user_icon} alt="" className="w-7 rounded-full" />
          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              src={assets.logout_icon}
              className="h-5 cursor-pointer hidden dark:invert-0 group-hover:block"
              alt="Logout"
            />
          )}
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