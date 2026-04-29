import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import stop_icon from "../../public/stop_icon.jpg";
import darkForWhite from "../assets/darkForWhite.png";
import whiteForDark from "../assets/whiteForDark.png";
import ModeSelect from "./ui/select";
import SendBtn from "./ui/sendBtn"


const ChatBox = () => {
  const { selectedChat, theme, handleThemeToggle } = useAppContext(); // ← добавь handleThemeToggle

  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

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

  const phrases = [
    "Ask me anything!",
    "What's on your mind?",
    "How can I help?",
    "What would you like to know?",
    "Let's talk!",
  ];

  const [placeholder] = useState(
    () => phrases[Math.floor(Math.random() * phrases.length)],
  );

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 backdrop-blur-sm">
      {/* ← Переключатель темы в правом верхнем углу */}
      {/* <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2 p-2 border dark:border-white/15 rounded-md">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={handleThemeToggle}
          />
        </div>
      </div> */}

      {/* Chat Container */}
      <div
        ref={containerRef}
        className="flex-1 mb-8 overflow-y-scroll scrollbar-hide max-h-[70vh]"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p
              className={`sm:text-7xl mb-6 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
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
        className="border border-primary dark:border-[#80609F]/50 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <ModeSelect mode={mode} setMode={setMode} />

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Задайте вопрос..."
          className="search-inp flex-1 w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          aria-label={loading ? "Остановить генерацию" : "Отправить сообщение"}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
         <SendBtn/>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
