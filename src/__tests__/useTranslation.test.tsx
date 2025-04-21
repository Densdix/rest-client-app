import { renderHook } from '@testing-library/react';
import { useTranslation } from '@/hooks/useTranslation';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as useLanguageModule from '@/hooks/useLanguage';

// Мок для translations
vi.mock('@/i18n/config', () => ({
  translations: {
    en: {
      common: {
        hello: 'Hello',
        nested: {
          value: 'Nested value',
        },
      },
      page: {
        title: 'Title',
      },
    },
    ru: {
      common: {
        hello: 'Привет',
        nested: {
          value: 'Вложенное значение',
        },
      },
      page: {
        title: 'Заголовок',
      },
    },
  },
  languages: ['en', 'ru'],
  defaultLanguage: 'en',
}));

describe('useTranslation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('возвращает перевод на английском по умолчанию', () => {
    // Мокируем useLanguage, чтобы он возвращал английский язык
    vi.spyOn(useLanguageModule, 'useLanguage').mockReturnValue({
      language: 'en',
      changeLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('common.hello')).toBe('Hello');
    expect(result.current.t('page.title')).toBe('Title');
  });

  it('возвращает перевод на русском', () => {
    // Мокируем useLanguage, чтобы он возвращал русский язык
    vi.spyOn(useLanguageModule, 'useLanguage').mockReturnValue({
      language: 'ru',
      changeLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('common.hello')).toBe('Привет');
    expect(result.current.t('page.title')).toBe('Заголовок');
  });

  it('возвращает ключ перевода, если перевод не найден', () => {
    vi.spyOn(useLanguageModule, 'useLanguage').mockReturnValue({
      language: 'en',
      changeLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('common.nonexistent')).toBe('common.nonexistent');
  });

  it('обрабатывает вложенные значения в переводах', () => {
    vi.spyOn(useLanguageModule, 'useLanguage').mockReturnValue({
      language: 'en',
      changeLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('common.nested.value')).toBe('Nested value');
  });

  it('возвращает ключ, если значение не является строкой', () => {
    vi.spyOn(useLanguageModule, 'useLanguage').mockReturnValue({
      language: 'en',
      changeLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('common.nested')).toBe('common.nested');
  });
});
