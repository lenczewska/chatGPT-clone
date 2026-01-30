// ChatBox.jsx
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import Message from "./Message";

const ChatBox = () => {
  const { selectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promt, setPromt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const onSybmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat */}
      <div className="flex-1 mb-5 overflow-y-scroll scrollbar-hide min-h-[60vh]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-600">
              Ask me anything
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white animate-bounce "></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white animate-bounce "></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white animate-bounce "></div>
          </div>
        )}
      </div>

      {/* Prompt box */}
      <form>
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="text">
            Image
          </option>
        </select>
        <input
          onChange={() => setPromt(e.target.value)}
          type="text"
          placeholder="Задайте вопрос..."
          className="flex-1 w-full text-sm outline-none"
          required
        />
      </form>
    </div>
  );
};

export default ChatBox;
