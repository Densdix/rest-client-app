import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    },
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Home Component', () => {
  it('отображает приветственное сообщение', async () => {
    render(await Home());
    expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();
  });

  it('отображает ссылки на страницы входа и регистрации', async () => {
    render(await Home());
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('имеет правильные ссылки для навигации', async () => {
    render(await Home());

    const signinLink = screen.getByText('Войти');
    const signupLink = screen.getByText('Регистрация');

    expect(signinLink.getAttribute('href')).toBe('/signin');
    expect(signupLink.getAttribute('href')).toBe('/signup');
  });
});
