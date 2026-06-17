// Message.jsx
import { assets } from "@/assets/assets";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import moment from "moment";
import "moment/locale/ru";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import Avatar from "./Avatar";

const Message = ({ message }) => {
  const { theme } = useAppContext();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  useEffect(() => {
    moment.locale(i18n.language || "en");
  }, [i18n.language]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const momentDate = moment(timestamp);
    const now = moment();
    const diffInHours = now.diff(momentDate, "hours");
    const diffInMinutes = now.diff(momentDate, "minutes");

    if (diffInMinutes < 1) {
      return t("time.justNow");
    } else if (diffInHours < 24) {
      return momentDate.fromNow();
    } else {
      return momentDate.format("DD.MM.YYYY HH:mm");
    }
  };

  const cleanMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.+?)\*\*/g, "$1") 
      .replace(/\*(.+?)\*/g, "$1") 
      .replace(/_(.+?)_/g, "$1"); 
  };

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-2 sm:my-4 gap-1 sm:gap-2">
          <div
            className={`flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 px-2 sm:px-4 rounded-lg max-w-[95vw] sm:max-w-2xl ${
              theme === "dark"
                ? "bg-[#57317C]/10 border border-[#80609F]/30"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <div className="text-xs sm:text-sm dark:text-primary markdown-content whitespace-pre-wrap">
              <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 dark:text-[#B1A6C0] self-end mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>

          <div><Avatar/></div>


         
        </div>
      ) : (
        <div
          className={`flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 px-2 sm:px-4 max-w-[95vw] sm:max-w-2xl rounded-lg my-2 sm:my-4 ${
            theme === "dark"
              ? "bg-[#57317C]/30 border border-[#80609F]/30"
              : "bg-primary/10 border border-slate-200"
          }`}
        >
          {message.isImage ? (
            <img
              src={message.content}
              className="w-full max-w-[80vw] sm:max-w-md rounded-md"
              alt=""
            />
          ) : (
            <div className="text-xs sm:text-sm dark:text-primary markdown-content whitespace-pre-wrap">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-[#B1A6C0] mt-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
