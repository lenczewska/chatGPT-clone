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
        "chatbox.placeholder": "Write a message...",
        "select.text": "Text",
        "select.image": "Image",
      },
    },

    ru: {
      translation: {
        "sidebar.newChat": "Новый чат",
        "sidebar.search": "Поиск в чатах",
        "sidebar.images": "Изображения",
        "sidebar.yourChats": "Ваши чаты",
        "sidebar.yesterday": "Вчера",
        "chatbox.placeholder": "Задайте вопрос...",
        "select.text": "Текст",
        "select.image": "Фото",
      },
    },
    az: {
      translation: {
        "sidebar.newChat": "Yeni çat",
        "sidebar.search": "Çatlarda axtar",
        "sidebar.images": "Şəkillər",
        "sidebar.yourChats": "Çatlarınız",
        "sidebar.yesterday": "Dünən",
        "chatbox.placeholder": "Sualınızı yazın...",
        "select.text": "Mətn",
        "select.image": "Şəkil",
      },
    },
  },
  lng: "ru",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
