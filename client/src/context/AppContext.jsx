import { createContext, use, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyUserData, dummyChats } from "../assets/assets";

const AppContext = createContext();

const readStoredValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error);
    return fallback;
  }
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(() => readStoredValue("fluxChats", []));
  const [selectedChat, setSelectedChat] = useState(() =>
    readStoredValue("fluxSelectedChat", null),
  );
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const deleteChat = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    setSelectedChat((prev) => (prev?._id === chatId ? null : prev));
  };

  useEffect(() => {
    const storedProjects = localStorage.getItem("fluxProjects");
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Failed to parse stored projects:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fluxProjects", JSON.stringify(projects));
  }, [projects]);

  const fetchUser = async () => {
    setUser();
  };

  const fetchUserChats = async () => {
    setChats(dummyChats);
    setSelectedChat();
  };
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      const storedChats = readStoredValue("fluxChats", []);
      const storedSelectedChat = readStoredValue("fluxSelectedChat", null);
      setChats(storedChats);
      setSelectedChat(storedSelectedChat);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxChats", JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedChat) {
        localStorage.setItem("fluxSelectedChat", JSON.stringify(selectedChat));
      } else {
        localStorage.removeItem("fluxSelectedChat");
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchUser();
  }, []);

  const createNewChat = () => {
    const newChat = {
      _id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: "New chat",
      title: "New chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChats((prev) => {
      if (prev.some((chat) => chat._id === newChat._id)) {
        return prev;
      }
      return [newChat, ...prev];
    });
    setSelectedChat(newChat);
    return newChat;
  };

  const value = {
    user,
    setUser,
    navigate,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    projects,
    setProjects,
    theme,
    setTheme,
    createNewChat,
    deleteChat,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
