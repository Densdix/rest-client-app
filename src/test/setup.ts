import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import React from 'react';

// Глобальное определение React для тестов
global.React = React;

// Мок для объекта localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Мок для объекта window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Очищаем моки перед каждым тестом
beforeEach(() => {
  vi.resetAllMocks();
});
