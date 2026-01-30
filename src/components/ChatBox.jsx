import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import stop_icon from "../../public/stop_icon.jpg";
import send_icon_dark from "../../public/send_icon_dark.png"
import send_icon_light from "../../public/send_icon_light.png"

const ChatBox = (theme, setTheme) => {
  const containerRef = useRef(null);
  const { selectedChat } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  // Загрузка сообщений при смене чата
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    console.log("=== ДИАГНОСТИКА ===");
    console.log("selectedChat:", selectedChat);
    console.log("messages:", messages);
    console.log("messages.length:", messages.length);
  }, [selectedChat]);

  useEffect(() => {
    console.log("=== СКРОЛЛ ===");
    console.log("containerRef.current:", containerRef.current);

    if (containerRef.current) {
      console.log("scrollHeight:", containerRef.current.scrollHeight);
      console.log("clientHeight:", containerRef.current.clientHeight);
      console.log("scrollTop ДО:", containerRef.current.scrollTop);

      containerRef.current.scrollTop = containerRef.current.scrollHeight;

      console.log("scrollTop ПОСЛЕ:", containerRef.current.scrollTop);
    }
  }, [messages]);
  // Обработчик отправки
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    try {
      setLoading(true);

      // TODO: Здесь будет API запрос
      const newMessage = {
        role: "user",
        content: prompt,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setPrompt("");

      // Если режим image и isPublished - логика публикации
      if (mode === "image" && isPublished) {
        // TODO: Логика публикации в сообщество
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Показать уведомление об ошибке
    } finally {
      setLoading(false);
    }
  };
  const getButtonIcon = () => {
    if (loading) return stop_icon;
    return theme === "dark" ? send_icon_light : send_icon_dark;
  };

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40backdrop-blur-sm">
      {/* Chat Container */}
      <div
        ref={containerRef}
        className="flex-1 mb-5 overflow-y-scroll scrollbar-hide max-h-[70vh]"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-600">
              Ask me anything
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

      {/* Publish to Community Checkbox */}
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="cursor-pointer"
          />
          <span className="text-xs">Опубликовать изображение в сообществе</span>
        </label>
      )}

      {/* Input Form */}
      <form
        onSubmit={onSubmit}
        className=" border border-primary dark:border-[#80609F]/50 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="search-box text-sm pl-3 pr-2 outline-none  text-[#801313] dark:text-white"
          aria-label="Select mode"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Задайте вопрос..."
          className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white placeholder:text-gray-400"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          aria-label={loading ? "Остановить генерацию" : "Отправить сообщение"}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src={getButtonIcon()}
            alt={loading ? "Stop" : "Send"}
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
