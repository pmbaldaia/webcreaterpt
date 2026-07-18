import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInstance, type LanguageDetectorModule } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/src/locales/en.json";
import pt from "@/src/locales/pt.json";

const LANGUAGE_STORAGE_KEY = "appLanguage";

const resources = {
  pt: { translation: pt },
  en: { translation: en },
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback: (lang: string) => void) => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((savedLang) => {
        if (savedLang) {
          callback(savedLang);
        } else {
          callback("pt");
        }
      })
      .catch(() => {
        callback("pt");
      });
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  },
} as unknown as LanguageDetectorModule;

const i18n = createInstance();

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
