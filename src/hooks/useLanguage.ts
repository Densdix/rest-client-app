import { useState, useEffect } from 'react';
import { Language, defaultLanguage } from '../i18n/config';

const LANGUAGE_CHANGE_EVENT = 'languageChange';

declare global {
  interface WindowEventMap {
    [LANGUAGE_CHANGE_EVENT]: CustomEvent<Language>;
  }
}

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLanguage }));
  };

  return { language, changeLanguage };
}; 