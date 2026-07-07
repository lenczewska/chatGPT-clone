import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import Select from "./ui/select";
import SendBtn from "./ui/sendBtn";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/az";

const ChatBox = () => {
  const {
    selectedChat,
    theme,
    setChats,
    setSelectedChat,
    chats,
    setChatPendingReply,
    isAuthenticated,
  } = useAppContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const modelDropdownRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [selectedModel, setSelectedModel] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
      setPrompt("");
      setFile(null);
      setFileDescription("");
    } else {
      setMessages([]);
      setPrompt("");
      setFile(null);
      setFileDescription("");
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target)
      ) {
        setIsModelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  const syncActiveChat = (
    chatId,
    nextMessages,
    title,
    shouldUpdateTitle = true,
  ) => {
    const existingChat =
      selectedChat || chats.find((chat) => chat._id === chatId) || null;
    const baseChat = existingChat || {
      _id: chatId,
      name: title,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
    };

    const previousTitle = baseChat.title || baseChat.name || "";
    const hasMeaningfulTitle = Boolean(
      previousTitle &&
      previousTitle !== "New chat" &&
      previousTitle !== "new chat",
    );
    const finalTitle =
      shouldUpdateTitle || !hasMeaningfulTitle ? title : previousTitle;

    const updatedChat = {
      ...baseChat,
      _id: chatId,
      name: finalTitle,
      title: finalTitle,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
      pendingBotReply: false, // ✅ всегда сбрасываем — раз идёт синхронизация, ждать больше нечего
    };

    setSelectedChat(updatedChat);
    setChats((prev) => {
      const exists = prev.some((chat) => chat._id === chatId);
      return exists
        ? prev.map((chat) => (chat._id === chatId ? updatedChat : chat))
        : [updatedChat, ...prev];
    });
  };
  // Запрос к боту — переиспользуется и при ручной отправке, и при автозапуске
  const sendToBot = async (chatId, currentMessages, chatTitle) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);

      const lastUserMessage = [...currentMessages]
        .reverse()
        .find((m) => m.role === "user");

      if (!lastUserMessage) return;

      const res = await fetch("http://localhost:3000/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: lastUserMessage.content }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      const botMessage = {
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...currentMessages, botMessage];
      setMessages(updatedMessages);
      syncActiveChat(chatId, updatedMessages, chatTitle, false);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sending message:", error);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  };

  // Автозапуск ответа бота для чата, созданного со страницы проекта
  useEffect(() => {
    if (
      selectedChat &&
      selectedChat.pendingBotReply &&
      (selectedChat.messages || []).length > 0
    ) {
      const msgs = selectedChat.messages;
      const title = selectedChat.title;
      const chatId = selectedChat._id;

      setChatPendingReply(chatId, false);
      sendToBot(chatId, msgs, title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?._id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (mode === "text" && !prompt.trim()) return;
    if (mode === "photo" && !file) return;

    try {
      const chatId = selectedChat?._id || `chat-${Date.now()}`;
      const chatTitle = prompt.trim().slice(0, 24) || "New chat";
      const existingChat =
        selectedChat || chats.find((chat) => chat._id === chatId) || null;
      const existingMessages = existingChat?.messages || [];
      const shouldSetInitialTitle =
        existingMessages.length === 0 &&
        (!existingChat?.title ||
          existingChat.title === "New chat" ||
          existingChat.title === "new chat");

      if (shouldSetInitialTitle) {
        syncActiveChat(chatId, [], chatTitle, true);
      }

      const newMessage = {
        role: "user",
        content:
          mode === "text"
            ? prompt
            : `${t("chatbox.attachedFile")}: ${file.name}\n${fileDescription}`,
        timestamp: new Date().toISOString(),
      };

      const currentMessages = [...existingMessages, newMessage];

      setMessages(currentMessages);
      syncActiveChat(chatId, currentMessages, chatTitle, false);
      setPrompt("");

      await sendToBot(chatId, currentMessages, chatTitle);

      setFile(null);
      setFileDescription("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const placeholder = useMemo(() => {
    const phrases = t("chatbox.phrases", { returnObjects: true });
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [i18n.language]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto flex-col px-1 sm:px-2 md:px-4 pb-4">
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto px-1 pb-4 sm:px-2"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <p
              className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {placeholder}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={message.timestamp || index} message={message} />
          ))
        )}

        {loading && (
          <div className="loader flex items-center gap-2 my-4">
            <div className="w-2 h-2 rounded-full bg-gray-700 dark:bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-gray-700 dark:bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-gray-700 dark:bg-gray-300 animate-bounce" />
          </div>
        )}
      </div>

        <form
          onSubmit={onSubmit}
          className={`mx-auto mt-2 flex w-full max-w-3xl items-center gap-2 rounded-full border p-2 sm:p-3 sm:pl-4 ${
            theme === "dark"
              ? "border-[#80609F]/50 bg-[#0f0f12] text-white"
              : "border-black bg-white text-black"
          } shadow-sm`}
        >
          <Select mode={mode} setMode={setMode} theme={theme} />

        {mode === "photo" ? (
          <div className="flex items-center gap-2 w-full">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />

            <label
              htmlFor="file-upload"
              className={`cursor-pointer px-3 py-1.5 rounded-4xl border hover:opacity-80 text-[13px] text-white
    ${theme === "dark" ? "bg-[#4A3A6B]" : "bg-black"}`}
            >
              {t("chatbox.chooseFile")}
            </label>

            <input
              type="text"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              className="flex-1 w-full text-xs sm:text-sm outline-none bg-transparent px-1 sm:px-2"
              disabled={loading}
            />
          </div>
        ) : (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("chatbox.placeholder")}
            className="search-inp flex-1 w-full text-xs sm:text-sm outline-none bg-transparent placeholder:text-gray-600 px-1 sm:px-2 resize-none overflow-hidden"
            disabled={loading}
            required
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading && prompt.trim()) {
                  onSubmit(e);
                }
              }
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        )}

        <div ref={modelDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsModelOpen((prev) => !prev)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
              theme === "dark"
                ? "border-[#80609F]/50 bg-[#4A3A6B] text-white hover:bg-[#5A4A7B]"
                : "border-black bg-black text-white hover:bg-[#222222]"
            }`}
          >
            <span>{selectedModel || t("chatbox.model")}</span>
            <span
              className={`text-xs transition-transform ${isModelOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {isModelOpen && (
            <div
              className={`absolute right-0 bottom-full mb-1 z-50 min-w-22 overflow-hidden rounded-xl border shadow-lg ${
                theme === "dark"
                  ? "border-[#80609F]/40 bg-[#1e1028] text-white"
                  : "border-gray-200 bg-white text-black"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedModel("");
                  setIsModelOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#57317C]/20"
              >
                {t("chatbox.model")}
              </button>
              {[1, 2, 3].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedModel(String(option));
                    setIsModelOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#57317C]/20"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type={loading ? "button" : "submit"}
          disabled={
            loading
              ? false
              : (mode === "text" && !prompt.trim()) ||
                (mode === "photo" && !file)
          }
          onClick={() => {
            if (loading) {
              handleStop();
            }
          }}
          aria-label={loading ? "Остановить генерацию" : "Отправить сообщение"}
          className="disabled:opacity-50 disabled:cursor-not-allowed w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <SendBtn theme={theme} loading={loading} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
