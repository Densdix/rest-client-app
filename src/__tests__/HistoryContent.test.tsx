import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentHistory from '@/app/(protected)/history/_components/Content';
import { useRouter } from 'next/navigation';
import { Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/utils/localstorage/variablesLocal', () => ({
  replaceVariables: vi.fn((text) => text),
}));

type HttpMethodColors = {
  GET: string;
  POST: string;
  PUT: string;
  PATCH: string;
  DELETE: string;
};

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

    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('отображает сообщение, если история пуста', () => {
    localStorage.removeItem('requestHistory');

    render(<ContentHistory />);

    expect(screen.getByText('История запросов пуста')).toBeInTheDocument();
    expect(screen.getByText('Вы ещё не выполнили ни одного запроса')).toBeInTheDocument();
    expect(screen.getByText('Перейти к Rest клиенту')).toBeInTheDocument();
  });

  it('отображает сохраненные запросы из истории', () => {
    const mockHistory = [
      {
        url: 'https://api.example.com/users',
        method: 'GET',
        timestamp: Date.now() - 60000,
      },
      {
        url: 'https://api.example.com/posts',
        method: 'POST',
        body: '{"title":"Test"}',
        timestamp: Date.now() - 3600000,
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

    fireEvent.click(screen.getByText('https://api.example.com/users'));

    expect(localStorage.getItem('currentRequest')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('currentRequest') as string)).toEqual(mockHistory[0]);
    expect(mockPush).toHaveBeenCalledWith('/restclient');
  });

  it('сортирует историю запросов по времени (сначала новые)', () => {
    const older = Date.now() - 3600000;
    const newer = Date.now() - 60000;

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

    const urls = screen.getAllByText(/https:\/\/api.example.com\//);

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

    const displayedBody = screen.getByText(/{"data":"x+/);
    expect(displayedBody.textContent?.length).toBeLessThan(longBody.length);
    expect(displayedBody.textContent?.endsWith('...')).toBe(true);
  });
});
