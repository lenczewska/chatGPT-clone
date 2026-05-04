import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Message from "./Message";
import stop_icon from "../../public/stop_icon.jpg";
import darkForWhite from "../assets/darkForWhite.png";
import whiteForDark from "../assets/whiteForDark.png";
import Select from "./ui/select";
import SendBtn from "./ui/sendBtn";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/az";

const ChatBox = () => {
  const { selectedChat, theme, handleThemeToggle } = useAppContext(); // ← добавь handleThemeToggle
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      const newMessage = {
        role: "user",
        content: prompt,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setPrompt("");
      if (mode === "image" && isPublished) {
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonIcon = () => {
    if (loading) return stop_icon;
    return theme === "dark" ? whiteForDark : darkForWhite;
  };

  const phrases = t("chatbox.phrases", { returnObjects: true });

  const placeholder = useMemo(() => {
    const phrases = t("chatbox.phrases", { returnObjects: true });
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [i18n.language]);

  return (
    <div className="flex-1 flex flex-col justify-between m-2 sm:m-4 md:m-8 xl:mx-30 max-md:mt-14 2xl:pr-40 backdrop-blur-sm min-h-[60vh] max-w-full">
      {/* Chat Container */}
      <div
        ref={containerRef}
        className="flex-1 mb-4 sm:mb-8 overflow-y-scroll scrollbar-hide max-h-[60vh] sm:max-h-[70vh] px-1 sm:px-0"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p
              className={`text-xl sm:text-4xl md:text-6xl lg:text-7xl mb-6 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
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

      {/* Input Form */}
      <form
        onSubmit={onSubmit}
        className="border border-primary dark:border-[#80609F]/50 rounded-full w-full max-w-2xl p-2 sm:p-3 sm:pl-4 mx-auto flex gap-2 sm:gap-4 items-center  dark:bg-gray-300 backdrop-blur-md"
      >
        <Select mode={mode} setMode={setMode} theme={theme} />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("chatbox.placeholder")}
          className="search-inp flex-1 w-full text-xs text-black sm:text-sm outline-none bg-transparent 
             placeholder:text-gray-400
             px-1 sm:px-2"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          aria-label={loading ? "Остановить генерацию" : "Отправить сообщение"}
          className="disabled:opacity-50 disabled:cursor-not-allowed w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <SendBtn theme={theme} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
