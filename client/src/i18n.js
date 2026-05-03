import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "hello": "Hello" } },
    ru: { translation: { "hello": "Привет" } },
    az: { translation: { "hello": "Salam" } }
  },
  lng: 'ru',
  fallbackLng: 'en',
});

export default i18n;