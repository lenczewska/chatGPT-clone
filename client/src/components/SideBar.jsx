import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image, PanelLeft, Search } from "lucide-react";
import Plus from "./ui/plus";
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
import Avatar from "./Avatar";
import SearchModal from "../components/SearchModal.jsx";
import useHotKeys from "./hooks/useHotKeys";
import logoFluxDark from "../../public/logoFluxDark.png";
import favFluxLogo from "../../public/favFluxLogo.png";
import logoFluxWhite from "../../public/logoFluxWhite.png";
import { assets } from "@/assets/assets";
import moment from "moment";
import "moment/locale/ru";
import Switch from "./ui/switch";
import LogOut from "./ui/logout";
import Version from "./ui/version";
import LanguageSwitcher from "./LanguageSwitcher";

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, theme, setTheme, user, setSelectedChat } = useAppContext();
  const [search] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar, state } = useSidebar();
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
    setTheme(newTheme);
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
              src={theme === "dark" ? logoFluxWhite : logoFluxDark}
              alt="Logo"
              className="h-6 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          {state === "collapsed" ? (
            <button
              onClick={toggleSidebar}
              className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors ml-auto"
              aria-label="Open sidebar"
            >
              <img src={favFluxLogo} alt="Logo" className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors ml-auto"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-5 w-5 text-sidebar-foreground" />
            </button>
          )}
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
                        className="cursor-pointer"
                        onClick={() => {
                          navigate("/");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Plus />
                        <span>Новый чат</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                      hidden={state === "expanded"}
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
                        className="cursor-pointer"
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                      >
                        <Search />
                        <span hidden={state === "collapsed"}>
                          Поиск в чатах
                        </span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                      hidden={state === "expanded"}
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
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/community");
                    setIsMenuOpen(false);
                  }}
                  isActive={location.pathname === "/image"}
                >
                  <Image />
                  <span>Изображения</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div
          className={`ml-4 mr-4 text-sm text-gray-500 border-t pt-3 ${state === "collapsed" ? "hidden" : ""}`}
        >
          <span>Ваши чаты</span>
        </div>

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
                      className="rounded-full bg-gray-400 w-5 h-5 p-1 cursor-pointer dark:invert-0 hover:bg-gray-700 transition-colors"
                      alt="Delete chat"
                    />
                  )}
                </div>
              );
            })}
        </div>

        <div
          className="group flex items-center justify-between mr-2 ml-2 gap-3 p-1 mt-3  
     border
     dark:border-white/15 
     rounded-md cursor-pointer 
     hover:bg-gray-100 dark:hover:bg-[#57317C]/20"
          style={{ borderColor: theme === "dark" ? undefined : "#E5E5E5" }}
        >
          <Avatar user={user} isDark={theme === "dark"} />
          {state !== "collapsed" && <LogOut isDark={theme === "dark"} />}
        </div>
      </SidebarContent>

      <SidebarFooter className="    ">
        <div
          className="flex  group items-center justify-between w-full pl-1 pr-1 pt-1 pb-1  border dark:border-white/15 rounded-md "
          hidden={state === "collapsed"}
          style={{ borderColor: theme === "dark" ? undefined : "#E5E5E5" }}
        >
          <Version theme={theme} />
          <LanguageSwitcher theme={theme} />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={handleThemeToggle}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
