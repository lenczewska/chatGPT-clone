import React from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/ui/select";
import SendBtn from "../components/ui/sendBtn";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { getSearchScore, normalizeText } from "@/lib/utils";
import { TfiArrowCircleLeft } from "react-icons/tfi";
import { RxDotsHorizontal } from "react-icons/rx";

const NewProjectChat = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [showMenu, setShowMenu] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    chats,
    theme,
    selectedProject,
    setSelectedChat,     
    createNewChat,
    addMessageToChat,
    setChatPendingReply, 
  } = useAppContext();

  const { t, i18n } = useTranslation();
  const createdDate = new Date().toLocaleDateString(i18n.language);

  const projectId = selectedProject?._id || selectedProject?.id;
  const projectChats = chats.filter((c) => c.projectId === projectId);
  const filteredProjectChats = (() => {
    const query = normalizeText(searchQuery);
    if (!query) return projectChats;

    return projectChats
      .map((chat) => {
        const title = normalizeText(chat.title || chat.name || "");
        const messagesText = normalizeText(
          (chat.messages || []).map((message) => message?.content || "").join(" "),
        );

        const score = Math.max(
          getSearchScore(title, query),
          getSearchScore(messagesText, query),
        );

        return { chat, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(b.chat.updatedAt || b.chat.createdAt) -
          new Date(a.chat.updatedAt || a.chat.createdAt)
        );
      })
      .map(({ chat }) => chat);
  })();

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

      // ✅ всегда создаём НОВЫЙ чат при отправке с этой страницы
      const chat = createNewChat(projectId);
      addMessageToChat(chat._id, newMessage);

      setPrompt("");
      setFile(null);
      setFileDescription("");
      setChatPendingReply(chat._id, true); 

      navigate({ pathname: "/chatBox", search: `?t=${Date.now()}` });
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
        <h3 className="pl-1 text-2xl font-semibold">
          {selectedProject?.name || "Project name"}
        </h3>
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
        <div className="space-y-2 w-full max-w-3xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по чатам проекта"
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-500 dark:border-gray-700 dark:placeholder:text-gray-400"
          />

          {filteredProjectChats.length === 0 ? (
            <p className="text-sm text-gray-500">
              {searchQuery ? "Ничего не найдено" : "Нет чатов в этом проекте"}
            </p>
          ) : (
            filteredProjectChats.map((chat) => (
              <div
                key={chat._id}
                className="flex items-center justify-between rounded-xl border p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                onClick={() => {
                  setSelectedChat(chat);
                  navigate({ pathname: "/chatBox", search: `?t=${Date.now()}` });
                }}
              >
                <span className="truncate">{chat.title || chat.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(
                    chat.updatedAt || chat.createdAt,
                  ).toLocaleDateString(i18n.language)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectChat;