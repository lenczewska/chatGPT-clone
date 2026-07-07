import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats } from "../assets/assets";

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

const deriveTitleFromMessage = (content, maxLen = 40) => {
  if (!content) return "New chat";
  const trimmed = content.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "…" : trimmed;
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("fluxAuthToken");
  });
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("fluxUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [chats, setChats] = useState(() => readStoredValue("fluxChats", []));
  const [selectedChat, setSelectedChat] = useState(() =>
    readStoredValue("fluxSelectedChat", null),
  );
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [selectedProject, setSelectedProject] = useState(() =>
    readStoredValue("fluxSelectedProject", null),
  );

  const isAuthenticated = Boolean(authToken && user);

  const deleteChat = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    setSelectedChat((prev) => (prev?._id === chatId ? null : prev));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedProject) {
        localStorage.setItem(
          "fluxSelectedProject",
          JSON.stringify(selectedProject),
        );
      } else {
        localStorage.removeItem("fluxSelectedProject");
      }
    }
  }, [selectedProject]);

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
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("fluxAuthToken");
    const storedUser = localStorage.getItem("fluxUser");

    setAuthToken(storedToken || null);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  const fetchUserChats = async () => {
    const storedChats = readStoredValue("fluxChats", []);
    const storedSelectedChat = readStoredValue("fluxSelectedChat", null);
    setChats(storedChats);
    setSelectedChat(storedSelectedChat);
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
    if (isAuthenticated) {
      fetchUserChats();
    } else {
      const storedChats = readStoredValue("fluxChats", []);
      const storedSelectedChat = readStoredValue("fluxSelectedChat", null);
      setChats(storedChats);
      setSelectedChat(storedSelectedChat);
    }
  }, [isAuthenticated]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (authToken) {
        localStorage.setItem("fluxAuthToken", authToken);
      } else {
        localStorage.removeItem("fluxAuthToken");
      }
    }
  }, [authToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("fluxUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("fluxUser");
      }
    }
  }, [user]);

  const createNewChat = (projectId = null) => {
    const newChat = {
      _id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: "New chat",
      title: "New chat",
      projectId,
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

  const addMessageToChat = (chatId, message) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat._id !== chatId) return chat;

        const isFirstMessage = (chat.messages || []).length === 0;
        const shouldUpdateTitle =
          isFirstMessage &&
          message.role === "user" &&
          chat.title === "New chat";

        const newTitle = shouldUpdateTitle
          ? deriveTitleFromMessage(message.content)
          : chat.title;

        return {
          ...chat,
          title: newTitle,
          name: newTitle,
          messages: [...(chat.messages || []), message],
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    setSelectedChat((prev) => {
      if (!prev || prev._id !== chatId) return prev;

      const isFirstMessage = (prev.messages || []).length === 0;
      const shouldUpdateTitle =
        isFirstMessage &&
        message.role === "user" &&
        prev.title === "New chat";

      const newTitle = shouldUpdateTitle
        ? deriveTitleFromMessage(message.content)
        : prev.title;

      return {
        ...prev,
        title: newTitle,
        name: newTitle,
        messages: [...(prev.messages || []), message],
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const setChatPendingReply = (chatId, pending) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId ? { ...chat, pendingBotReply: pending } : chat,
      ),
    );
    setSelectedChat((prev) =>
      prev && prev._id === chatId
        ? { ...prev, pendingBotReply: pending }
        : prev,
    );
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    localStorage.removeItem("fluxAuthToken");
    localStorage.removeItem("fluxUser");
    localStorage.removeItem("fluxChats");
    localStorage.removeItem("fluxSelectedChat");
    navigate("/login");
  };

  const value = {
    user,
    setUser,
    authToken,
    setAuthToken,
    isAuthenticated,
    navigate,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    selectedProject,
    setSelectedProject,
    projects,
    setProjects,
    theme,
    setTheme,
    createNewChat,
    deleteChat,
    addMessageToChat,
    setChatPendingReply,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);