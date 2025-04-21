import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '@/hooks/useLanguage';
import { defaultLanguage } from '@/i18n/config';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

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
    const { result: result1 } = renderHook(() => useLanguage());
    const { result: result2 } = renderHook(() => useLanguage());

    expect(result1.current.language).toBe(defaultLanguage);
    expect(result2.current.language).toBe(defaultLanguage);

    act(() => {
      result1.current.changeLanguage('ru');
    });

    expect(result1.current.language).toBe('ru');
    expect(result2.current.language).toBe('ru');
  });
});
