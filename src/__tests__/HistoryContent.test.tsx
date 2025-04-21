import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentHistory from '@/app/(protected)/history/_components/Content';
import { useRouter } from 'next/navigation';
import { Mock } from 'vitest';

// Мок для next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Мок для variablesLocal
vi.mock('@/utils/localstorage/variablesLocal', () => ({
  replaceVariables: vi.fn((text) => text),
}));

// Типизация для цветов методов
type HttpMethodColors = {
  GET: string;
  POST: string;
  PUT: string;
  PATCH: string;
  DELETE: string;
};

// Мок для getMethodColor
vi.mock('@/utils/getMethodColor', () => ({
  getMethodColor: vi.fn((method: string) => {
    const colors: HttpMethodColors = {
      GET: 'bg-green-500 text-white',
      POST: 'bg-blue-500 text-white',
      PUT: 'bg-yellow-500 text-black',
      PATCH: 'bg-orange-500 text-white',
      DELETE: 'bg-red-500 text-white',
    };
    return colors[method as keyof HttpMethodColors] || 'bg-gray-500 text-white';
  }),
}));

describe('ContentHistory', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });

    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('отображает сообщение, если история пуста', () => {
    // Убеждаемся, что localStorage пуст
    localStorage.removeItem('requestHistory');

    render(<ContentHistory />);

    expect(screen.getByText('История запросов пуста')).toBeInTheDocument();
    expect(screen.getByText('Вы ещё не выполнили ни одного запроса')).toBeInTheDocument();
    expect(screen.getByText('Перейти к Rest клиенту')).toBeInTheDocument();
  });

  it('отображает сохраненные запросы из истории', () => {
    // Имитируем историю запросов в localStorage
    const mockHistory = [
      {
        url: 'https://api.example.com/users',
        method: 'GET',
        timestamp: Date.now() - 60000, // 1 минуту назад
      },
      {
        url: 'https://api.example.com/posts',
        method: 'POST',
        body: '{"title":"Test"}',
        timestamp: Date.now() - 3600000, // 1 час назад
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    expect(screen.getByText('История запросов')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/users')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/posts')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('отображает заголовки запроса, если они есть', () => {
    const mockHistory = [
      {
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: [
          { name: 'Content-Type', value: 'application/json', isActive: true },
          { name: 'Authorization', value: 'Bearer token123', isActive: true },
        ],
        timestamp: Date.now(),
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    expect(screen.getByText('Заголовки:')).toBeInTheDocument();
    expect(screen.getByText(/Content-Type:/)).toBeInTheDocument();
    expect(screen.getByText(/application\/json/)).toBeInTheDocument();
    expect(screen.getByText(/Authorization:/)).toBeInTheDocument();
    expect(screen.getByText(/Bearer token123/)).toBeInTheDocument();
  });

  it('отображает тело запроса, если оно есть', () => {
    const mockHistory = [
      {
        url: 'https://api.example.com/data',
        method: 'POST',
        body: '{"name":"Test","id":123}',
        timestamp: Date.now(),
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    expect(screen.getByText('Тело запроса:')).toBeInTheDocument();
    expect(screen.getByText(/{"name":"Test","id":123}/)).toBeInTheDocument();
  });

  it('переходит к REST-клиенту с выбранным запросом при клике', () => {
    const mockHistory = [
      {
        url: 'https://api.example.com/users',
        method: 'GET',
        timestamp: Date.now(),
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    // Кликаем на запись в истории
    fireEvent.click(screen.getByText('https://api.example.com/users'));

    // Проверяем, что запрос был сохранен в localStorage и выполнен переход
    expect(localStorage.getItem('currentRequest')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('currentRequest') as string)).toEqual(mockHistory[0]);
    expect(mockPush).toHaveBeenCalledWith('/restclient');
  });

  it('сортирует историю запросов по времени (сначала новые)', () => {
    const older = Date.now() - 3600000; // 1 час назад
    const newer = Date.now() - 60000; // 1 минута назад

    const mockHistory = [
      {
        url: 'https://api.example.com/older',
        method: 'GET',
        timestamp: older,
      },
      {
        url: 'https://api.example.com/newer',
        method: 'POST',
        timestamp: newer,
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    // Получаем все URL элементы
    const urls = screen.getAllByText(/https:\/\/api.example.com\//);

    // Проверяем, что более новый запрос отображается первым
    expect(urls[0]).toHaveTextContent('https://api.example.com/newer');
    expect(urls[1]).toHaveTextContent('https://api.example.com/older');
  });

  it('обрезает длинное тело запроса', () => {
    const longBody = '{"data":"' + 'x'.repeat(200) + '"}';

    const mockHistory = [
      {
        url: 'https://api.example.com/data',
        method: 'POST',
        body: longBody,
        timestamp: Date.now(),
      },
    ];

    localStorage.setItem('requestHistory', JSON.stringify(mockHistory));

    render(<ContentHistory />);

    // Проверяем, что тело запроса обрезано и добавлено многоточие
    const displayedBody = screen.getByText(/{"data":"x+/);
    expect(displayedBody.textContent?.length).toBeLessThan(longBody.length);
    expect(displayedBody.textContent?.endsWith('...')).toBe(true);
  });
});
