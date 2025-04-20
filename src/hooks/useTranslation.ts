import { translations } from '../i18n/config';
import { useLanguage } from './useLanguage';
import { useCallback } from 'react';

type TranslationValue = string | Record<string, unknown>;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k] as TranslationValue;
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }, [language]);

  return { t };
}; 