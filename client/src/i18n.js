import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "sidebar.newChat": "New Chat",
        "sidebar.search": "Search chats",
        "sidebar.images": "Images",
        "sidebar.yourChats": "Your chats",
        "sidebar.yesterday": "Yesterday",
        "select.text": "Text",
        "select.image": "Image",
        "chatbox.placeholder": "Write a message...",
        "chatbox.phrases": [
          "Ask me anything!",
          "What's on your mind?",
          "How can I help?",
          "What would you like to know?",
          "Let's talk!",
        ],
      },
    },

    ru: {
      translation: {
        "sidebar.newChat": "Новый чат",
        "sidebar.search": "Поиск в чатах",
        "sidebar.images": "Изображения",
        "sidebar.yourChats": "Ваши чаты",
        "sidebar.yesterday": "Вчера",
        "select.text": "Текст",
        "select.image": "Фото",
        "chatbox.placeholder": "Задайте вопрос...",
        "chatbox.phrases": [
          "Задайте вопрос!",
          "О чём думаете?",
          "Чем могу помочь?",
          "Что хотите узнать?",
          "Давайте общаться!",
        ],
      },
    },
    az: {
      translation: {
        "sidebar.newChat": "Yeni çat",
        "sidebar.search": "Çatlarda axtar",
        "sidebar.images": "Şəkillər",
        "sidebar.yourChats": "Çatlarınız",
        "sidebar.yesterday": "Dünən",
        "select.text": "Mətn",
        "select.image": "Şəkil",
        "chatbox.placeholder": "Sualınızı yazın...",
        "chatbox.phrases": [
          "Sual verin!",
          "Nə düşünürsünüz?",
          "Necə kömək edə bilərəm?",
          "Nə bilmək istəyirsiniz?",
          "Gəlin danışaq!",
        ],
      },
    },
  },
  lng: localStorage.getItem("language") || "ru", 
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
