import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Message from "./Message";
import Select from "./ui/select";
import SendBtn from "./ui/sendBtn";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/az";

const ChatBox = () => {
  const { selectedChat, theme, setChats, setSelectedChat, chats } = useAppContext();
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  const syncActiveChat = (chatId, nextMessages, title) => {
    const baseChat = selectedChat || {
      _id: chatId,
      name: title,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
    };

    const updatedChat = {
      ...baseChat,
      _id: chatId,
      name: title,
      title,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
    };

    setSelectedChat(updatedChat);
    setChats((prev) => {
      const exists = prev.some((chat) => chat._id === chatId);
      return exists
        ? prev.map((chat) => (chat._id === chatId ? updatedChat : chat))
        : [updatedChat, ...prev];
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (mode === "text" && !prompt.trim()) return;
    if (mode === "photo" && !file) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);

      const chatId = selectedChat?._id || `chat-${Date.now()}`;
      const chatTitle = prompt.trim().slice(0, 24) || "New chat";

      if (!selectedChat) {
        syncActiveChat(chatId, [], chatTitle);
      }

      const newMessage = {
        role: "user",
        content:
          mode === "text"
            ? prompt
            : `${t("chatbox.attachedFile")}: ${file.name}\n${fileDescription}`,
        timestamp: new Date().toISOString(),
      };
      const userMessageToStore = {
        ...newMessage,
        timestamp: new Date().toISOString(),
      };
      const currentMessages = [...(selectedChat?.messages || []), userMessageToStore];

      setMessages(currentMessages);
      syncActiveChat(chatId, currentMessages, chatTitle);
      setPrompt("");

      const res = await fetch("http://localhost:3000/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.content }),
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
      syncActiveChat(chatId, updatedMessages, chatTitle);

      setFile(null);
      setFileDescription("");
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
            {/* Скрытый file input */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />

            {/* Кастомная кнопка */}
            <label
              htmlFor="file-upload"
              className={`cursor-pointer px-3 py-1.5 rounded-4xl border hover:opacity-80 text-[13px] text-white
    ${theme === "dark" ? "bg-[#6D5FB9]" : "bg-black"}`}
            >
              {t("chatbox.chooseFile")}
            </label>

            {/* Поле для описания файла */}
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

        <select name="models" id="">
          <optgroup label={t("chatbox.model")}>
            <option value="">{t("chatbox.model")}</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </optgroup>
        </select>

        <button
          type={loading ? "button" : "submit"}
          disabled={loading ? false : (mode === "text" && !prompt.trim()) || (mode === "photo" && !file)}
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
