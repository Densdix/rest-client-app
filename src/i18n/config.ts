import en from '../translations/en.json';
import ru from '../translations/ru.json';

export type Language = 'en' | 'ru';

export const languages: Language[] = ['en', 'ru'];

export const defaultLanguage: Language = 'en';

export const translations = {
  en,
  ru,
} as const;

export type TranslationKey = keyof typeof translations.en; 