import React from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/ui/select";
import SendBtn from "../components/ui/sendBtn";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { TfiArrowCircleLeft } from "react-icons/tfi";
import { RxDotsHorizontal } from "react-icons/rx";


const NewProjectChat = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const { theme } = useAppContext();
  const { t, i18n } = useTranslation();
  const createdDate = new Date().toLocaleDateString(i18n.language);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (mode === "text" && !prompt.trim()) return;
    if (mode === "photo" && !file) return;

    try {
      setLoading(true);
      const newMessage = {
        role: "user",
        content:
          mode === "text"
            ? prompt
            : `${t("chatbox.attachedFile")}: ${file.name}\n${fileDescription}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setPrompt("");
      setFile(null);
      setFileDescription("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-6xl mx-auto px-3 pb-8 sm:px-4 md:px-6">
      <div className="flex items-center">
        <h2
          className="flex cursor-pointer items-center pb-6 text-base sm:text-lg"
          onClick={() => navigate("/projects")}
        >
          <TfiArrowCircleLeft className="mr-2 h-4 w-4" />
          All projects
        </h2>
      </div>

      <div className="space-y-6">
        <h3 className="pl-1 text-2xl font-semibold">Project name</h3>

        <form
          onSubmit={onSubmit}
          className={`flex w-full max-w-3xl items-center gap-2 rounded-2xl border p-2 sm:p-3 sm:pl-4 ${
            theme === "dark"
              ? "border-[#80609F]/50 bg-[#0f0f12] text-white"
              : "border-black bg-white text-black"
          } shadow-sm`}
        >
          <Select mode={mode} setMode={setMode} theme={theme} />

          {mode === "photo" ? (
            <div className="flex w-full items-center gap-2">
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
                className={`cursor-pointer rounded-4xl border px-3 py-1.5 text-[13px] text-white hover:opacity-80 ${
                  theme === "dark" ? "bg-[#6D5FB9]" : "bg-black"
                }`}
              >
                {t("chatbox.chooseFile")}
              </label>

              <input
                type="text"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                className="w-full flex-1 bg-transparent px-1 text-xs outline-none sm:text-sm"
                disabled={loading}
              />
            </div>
          ) : (
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("chatbox.placeholder")}
              className="w-full flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-gray-600 sm:text-sm"
              disabled={loading}
              required
            />
          )}

          <select name="models" id="" className="hidden sm:block">
            <optgroup label={t("chatbox.model")}>
              <option value="">{t("chatbox.model")}</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </optgroup>
          </select>

          <button
            type="submit"
            disabled={
              loading ||
              (mode === "text" && !prompt.trim()) ||
              (mode === "photo" && !file)
            }
            aria-label={
              loading ? "Остановить генерацию" : "Отправить сообщение"
            }
            className="flex h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
          >
            <SendBtn theme={theme} />
          </button>
        </form>

        <div className="relative flex min-h-32 w-full max-w-3xl items-center gap-2 rounded-xl border p-5">
          <span className="pr-14 text-sm text-gray-500 transition-opacity duration-200 group-hover:opacity-0 dark:text-gray-400">
            {createdDate}
          </span>

          <button
            type="button"
            className="absolute right-4 flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <RxDotsHorizontal className="h-6 w-10" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border bg-white shadow-lg dark:border-gray-700 dark:bg-[#f2f2f2]">
              <button
                type="button"
                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:rounded-xl hover:bg-gray-50 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                Option 1
              </button>
              <button
                type="button"
                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:rounded-xl hover:bg-gray-50 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                Option 2
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectChat;
