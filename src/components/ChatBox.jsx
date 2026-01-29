import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import gpt_logo from "../../public/gpt_logo.png";
import gpt_logo_white from "../../public/gpt_logo_white.png";
const ChatBox = () => {
  const { selectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat */}
      <div
        className="flex-1 mb-5 overflow-y-scroll min-h-[60vh] 
                rounded-xl"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-900 dark:text-gray-100">
              Ask me anything
            </p>
          </div>
        )}
      </div>

      {/* Promt box */}
    </div>
  );
};

export default ChatBox;
