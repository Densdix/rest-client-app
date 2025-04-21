import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClientHeader } from '../components/ClientHeader';
import { User } from '@supabase/supabase-js';

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    changeLanguage: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.history': 'History',
        'common.restClient': 'REST Client',
        'common.variables': 'Variables',
        'common.logout': 'Logout',
        'common.login': 'Login',
        'common.signup': 'Sign up',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
  };
});

vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: ({
      src,
      alt,
      width,
      height,
      className,
    }: {
      src: string;
      alt: string;
      width: number;
      height: number;
      className?: string;
    }) => <img src={src} alt={alt} width={width} height={height} className={className} />,
  };
});

describe('ClientHeader', () => {
  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00Z',
  } as User;

  beforeEach(() => {
    vi.stubGlobal('addEventListener', vi.fn());
    vi.stubGlobal('removeEventListener', vi.fn());
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('отображает логотип приложения', () => {
    render(<ClientHeader user={null} />);

    const logoImage = screen.getByAltText('app logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/logo.jpg');
  });

  it('отображает ссылки на вход и регистрацию для неаутентифицированного пользователя', () => {
    render(<ClientHeader user={null} />);

    const loginLink = screen.getByText('Login');
    const signupLink = screen.getByText('Sign up');

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/signin');

    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('отображает навигацию и email для аутентифицированного пользователя', () => {
    render(<ClientHeader user={mockUser} />);

    const historyLink = screen.getByText('History');
    const restClientLink = screen.getByText('REST Client');
    const variablesLink = screen.getByText('Variables');

    expect(historyLink).toBeInTheDocument();
    expect(historyLink).toHaveAttribute('href', '/history');

    expect(restClientLink).toBeInTheDocument();
    expect(restClientLink).toHaveAttribute('href', '/restclient');

    expect(variablesLink).toBeInTheDocument();
    expect(variablesLink).toHaveAttribute('href', '/variables');

    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
