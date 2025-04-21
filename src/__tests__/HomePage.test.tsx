import React from 'react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as supabaseServer from '@/utils/supabase/server';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(),
  };
});

import Home from '../app/page';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('перенаправляет на /main, если пользователь авторизован', async () => {
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

    await Home();

    expect(redirectMock).toHaveBeenCalledWith('/main');
  });

  it('отображает ссылки на страницы входа и регистрации, если пользователь не авторизован', async () => {
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    };

    (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

    const homeComponent = await Home();
    render(homeComponent);

    expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();

    const loginLink = screen.getByText('Войти');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/signin');

    const registerLink = screen.getByText('Регистрация');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/signup');
  });
});
