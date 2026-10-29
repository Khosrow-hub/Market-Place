import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationDARI from './locales/dari/translation.json';
import translationPS from './locales/pashto/translation.json';

// Translation resources
const resources = {
  en: {
    translation: translationEN
  },
  dari: {
    translation: translationDARI
  },
  ps: {
    translation: translationPS
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    lng: localStorage.getItem('i18nextLng') || 'dari'
  });

export default i18n;
