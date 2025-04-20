import { translations } from '../i18n/config';
import { useLanguage } from './useLanguage';

type TranslationValue = string | Record<string, unknown>;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
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
  };

  return { t };
}; 