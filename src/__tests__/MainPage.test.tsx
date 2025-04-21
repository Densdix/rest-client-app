import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainPage from '@/app/(protected)/main/page';

// Мокаем модули и функции
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: {
            user: { email: 'test@example.com' },
          },
        })
      ),
    },
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('MainPage Component', () => {
  it('отображает email пользователя', async () => {
    render(await MainPage());
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('отображает кнопку выхода', async () => {
    render(await MainPage());
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('отображает ссылки на другие страницы', async () => {
    render(await MainPage());

    expect(screen.getByText('История')).toBeInTheDocument();
    expect(screen.getByText('Rest client')).toBeInTheDocument();
    expect(screen.getByText('Переменные')).toBeInTheDocument();
  });

  it('имеет правильные ссылки для навигации', async () => {
    render(await MainPage());

    const historyLink = screen.getByText('История');
    const restClientLink = screen.getByText('Rest client');
    const variablesLink = screen.getByText('Переменные');

    expect(historyLink.getAttribute('href')).toBe('/history');
    expect(restClientLink.getAttribute('href')).toBe('/restclient');
    expect(variablesLink.getAttribute('href')).toBe('/variables');
  });
});
