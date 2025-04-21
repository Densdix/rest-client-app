import { useState, useEffect } from 'react';
import { Language, defaultLanguage } from '../i18n/config';

const languageEventService = {
  listeners: new Set<(lang: Language) => void>(),

  subscribe(listener: (lang: Language) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },

  emit(language: Language) {
    this.listeners.forEach((listener) => listener(language));
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    const handleLanguageChange = (newLanguage: Language) => {
      setLanguage(newLanguage);
    };

    const unsubscribe = languageEventService.subscribe(handleLanguageChange);
    return unsubscribe;
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    languageEventService.emit(newLanguage);
  };

  return { language, changeLanguage };
};
