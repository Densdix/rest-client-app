import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '@/hooks/useLanguage';
import { defaultLanguage } from '@/i18n/config';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Мок для локального хранилища
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Переопределение глобального localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useLanguage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('возвращает язык по умолчанию, если язык не сохранен', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe(defaultLanguage);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('language');
  });

  it('возвращает сохраненный язык из localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('ru');

    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('ru');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('language');
  });

  it('изменяет язык и сохраняет в localStorage', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.changeLanguage('ru');
    });

    expect(result.current.language).toBe('ru');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'ru');
  });

  it('синхронизирует язык между несколькими экземплярами хука', () => {
    // Рендерим два хука для симуляции использования в разных компонентах
    const { result: result1 } = renderHook(() => useLanguage());
    const { result: result2 } = renderHook(() => useLanguage());

    // Убеждаемся, что начальный язык одинаков
    expect(result1.current.language).toBe(defaultLanguage);
    expect(result2.current.language).toBe(defaultLanguage);

    // Меняем язык в первом хуке
    act(() => {
      result1.current.changeLanguage('ru');
    });

    // Проверяем, что язык изменился в обоих хуках
    expect(result1.current.language).toBe('ru');
    expect(result2.current.language).toBe('ru');
  });
});
