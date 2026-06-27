import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image, PanelLeft, Search } from "lucide-react";
import Plus from "./ui/plus";
import { FaRegFolderOpen, FaRegStar, FaStar, FaPen } from "react-icons/fa6";
import { MdAttachFile, MdOutlineDeleteOutline } from "react-icons/md";
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
import Switch from "./ui/switch";
import LogOut from "./ui/logout";
import Version from "./ui/version";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/az";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const {
    chats,
    theme,
    setTheme,
    user,
    setSelectedChat,
    projects,
    setProjects,
    deleteChat,
    setSelectedProject,
    createNewChat,
  } = useAppContext();
  const [activeMenu, setActiveMenu] = useState(null);
  const [search] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar, state } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState(null);

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

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

  const starredProjects = projects.filter((p) => p.starred);

  const handleToggleStar = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        const id = p._id || p.id;
        if (id === projectId) return { ...p, starred: !p.starred };
        return p;
      }),
    );
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    if (typeof deleteChat === "function") {
      deleteChat(chatId);
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prev) =>
      prev.filter((project) => (project._id || project.id) !== projectId),
    );
    setActiveMenu(null);
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
        lastDay: `[${t("sidebar.yesterday")}]`,
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
        <div className="flex items-center justify-between px-3 py-3 sm:px-2 sm:py-2">
          <Link
            to="/"
            className="flex min-w-0 items-center group-data-[collapsible=icon]:hidden"
          >
            <img
              src={theme === "dark" ? logoFluxWhite : logoFluxDark}
              alt="Logo"
              className="h-8 w-20 max-w-20 shrink-0 object-contain transition-opacity hover:opacity-80"
            />
          </Link>
          {state === "collapsed" ? (
            <button
              onClick={toggleSidebar}
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent"
              aria-label="Open sidebar"
            >
              <img
                src={favFluxLogo}
                alt="Logo"
                className="h-6 w-6 object-contain cursor-pointer"
              />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent"
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
                          createNewChat();
                          navigate("/");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Plus />
                        {state === "expanded" && (
                          <span
                            className={`${
                              theme === "dark" ? "text-white" : "text-[#888888]"
                            }`}
                          >
                            {t("sidebar.newChat")}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                      hidden={state === "expanded"}
                    >
                      <p className="text-xs text-gray-600">
                        {t("sidebar.newChat")}
                      </p>
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
                        {state === "expanded" && (
                          <span
                            className={`${
                              theme === "dark" ? "text-white" : "text-[#888888]"
                            }`}
                          >
                            {t("sidebar.search")}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-gray-200 text-white"
                      hidden={state === "expanded"}
                    >
                      <p className="text-xs text-gray-600">
                        {t("sidebar.search")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>

              <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/community");
                    setIsMenuOpen(false);
                  }}
                  isActive={location.pathname === "/community"}
                >
                  <Image />
                  {state === "expanded" && (
                    <span
                      className={`${
                        theme === "dark" ? "text-white" : "text-[#888888]"
                      }`}
                    >
                      {t("sidebar.images")}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/projects");
                    setIsMenuOpen(false);
                  }}
                  isActive={location.pathname === "/projects"}
                >
                  <FaRegFolderOpen />
                  {state === "expanded" && (
                    <span
                      className={`${
                        theme === "dark" ? "text-white" : "text-[#888888]"
                      }`}
                    >
                      {t("sidebar.projects")}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Starred projects */}
        <div
          className={`ml-4 mr-4 text-sm border-t pt-3 ${
            state === "collapsed" ? "hidden" : ""
          } ${theme === "dark" ? "text-red-800" : "text-white"}`}
        >
          <span className="text-[#aaa]">{t("sidebar.starred")}</span>
          <ul className="mt-2 flex flex-col gap-2">
            {starredProjects.map((p) => {
              const projectId = p._id || p.id;
              return (
                <li
                  key={projectId}
                  className="relative flex items-center justify-between cursor-pointer rounded-md px-2 py-2 transition-colors duration-100 border"
                  onClick={() => {
                    setSelectedProject(p);
                    navigate("/newProjectChat");
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MdAttachFile className="shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </div>

                  <button
                    type="button"
                    className="ml-2 p-1 transition-colors shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(
                        activeMenu === projectId ? null : projectId,
                      );
                    }}
                  >
                    <HiOutlineDotsHorizontal
                      className={`w-8 h-8 text-xl pr-0.5 pl-0.5 rounded-sm cursor-pointer ${
                        theme === "dark"
                          ? "hover:bg-gray-900"
                          : "hover:bg-gray-200"
                      }`}
                    />
                  </button>

                  {activeMenu === projectId && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div
                        className={`absolute right-0 top-8 mt-1 w-32 rounded-lg border shadow-lg z-20 ${
                          theme === "dark"
                            ? "border-gray-800 bg-black"
                            : "border-gray-200 bg-white"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm border-b rounded-t-lg cursor-pointer transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(null);
                            handleToggleStar(projectId);
                          }}
                        >
                          {p.starred ? (
                            <FaStar className="text-[#8e6ad4]" />
                          ) : (
                            <FaRegStar className="text-gray-400" />
                          )}
                          Star
                        </button>

                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm rounded-b-lg cursor-pointer transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(projectId);
                          }}
                        >
                          <MdOutlineDeleteOutline />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Your chats */}
        <div
          className={`ml-4 mr-4 text-sm text-gray-500 border-t pt-3 ${
            state === "collapsed" ? "hidden" : ""
          }`}
        >
          <span className="text-[#aaa]">{t("sidebar.yourChats")}</span>
        </div>

        <div className="flex-1 overflow-y-scroll scrollbar-hide mt-3 text-sm space-y-3 ml-2 mr-2">
          {chats.map((chat) => {
            const chatTitle = chat.title || chat.name || "New chat";
            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className="p-2 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-[#57317C]/20 transition-colors"
              >
                <div className="flex flex-col overflow-hidden flex-1">
                  <p className="truncate font-medium">{chatTitle}</p>
                  <span className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                    {formatTime(chat.updatedAt || chat.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>


        <div
          className="group flex items-center justify-between mr-2 ml-2 gap-3 p-1 mt-3 border dark:border-white/15 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-[#57317C]/20"
          style={{ borderColor: theme === "dark" ? undefined : "#E5E5E5" }}
        >
          <Avatar user={user} isDark={theme === "dark"} />
          {state !== "collapsed" && <LogOut isDark={theme === "dark"} />}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div
          className="flex group items-center justify-between w-full pl-1 pr-1 pt-1 pb-1 border dark:border-white/15 rounded-md"
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
