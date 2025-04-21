import React from 'react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as supabaseServer from '@/utils/supabase/server';

// Мок для Next.js Link компонента
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

// Мок для функции createClient из supabase/server
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Мок для функции redirect из next/navigation
vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(),
  };
});

// Импорт Home должен быть после определения всех моков
import Home from '../app/page';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('перенаправляет на /main, если пользователь авторизован', async () => {
    // Настройка мока для supabase клиента
    const mockUser = { email: 'test@example.com' };
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
        }),
      },
    };

    (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);
    const redirectMock = vi.mocked(await import('next/navigation')).redirect;

    // Рендерим компонент
    await Home();

    // Проверяем, что пользователь был перенаправлен на /main
    expect(redirectMock).toHaveBeenCalledWith('/main');
  });

  it('отображает ссылки на страницы входа и регистрации, если пользователь не авторизован', async () => {
    // Настройка мока для supabase клиента
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    };

    (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

    // Рендерим компонент
    const homeComponent = await Home();
    render(homeComponent);

    // Проверяем наличие текста приветствия
    expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();

    // Проверяем наличие ссылок на страницы входа и регистрации
    const loginLink = screen.getByText('Войти');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/signin');

    const registerLink = screen.getByText('Регистрация');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/signup');
  });
});
