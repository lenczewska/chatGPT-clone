// Message.jsx
import { assets } from "@/assets/assets";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const momentDate = moment(timestamp);
    const now = moment();
    const diffInHours = now.diff(momentDate, "hours");
    const diffInMinutes = now.diff(momentDate, "minutes");

    if (diffInMinutes < 1) {
      return "только что";
    } else if (diffInHours < 24) {
      return momentDate.fromNow();
    } else {
      return momentDate.format("DD.MM.YYYY HH:mm");
    }
  };

  // Функция для очистки markdown символов, если нужно
  const cleanMarkdown = (text) => {
    if (!text) return "";
    // Убираем звездочки для жирного текста **text** и *text*
    return text
      .replace(/\*\*(.+?)\*\*/g, "$1") // Убираем **жирный**
      .replace(/\*(.+?)\*/g, "$1") // Убираем *курсив*
      .replace(/_(.+?)_/g, "$1"); // Убираем _курсив_
  };

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          <div className="flex flex-col gap-2 p-3 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-lg max-w-2xl">
            <div className="text-sm dark:text-primary markdown-content whitespace-pre-wrap">
              <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-xs text-gray-400 dark:text-[#B1A6C0] self-end mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <img
            src={assets.user_icon}
            className="w-8 h-8 rounded-full flex-shrink-0"
            alt=""
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-lg my-4">
          {message.isImage ? (
            <img
              src={message.content}
              className="w-full max-w-md rounded-md"
              alt=""
            />
          ) : (
            <div className="text-sm dark:text-primary markdown-content whitespace-pre-wrap">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className="text-xs text-gray-400 dark:text-[#B1A6C0] mt-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
