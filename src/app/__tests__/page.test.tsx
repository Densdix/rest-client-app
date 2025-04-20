import { render, screen } from '@testing-library/react';
import Home from '../page';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Mock the Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /main when user is authenticated', async () => {
    // Mock authenticated user
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: '123' } },
        }),
      },
    });

    await Home();
    expect(redirect).toHaveBeenCalledWith('/main');
  });

  it('should render welcome message and auth links when user is not authenticated', async () => {
    // Mock unauthenticated user
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    });

    render(await Home());

    // Check welcome message
    expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();

    // Check auth links
    const signInLink = screen.getByText('Войти');
    const signUpLink = screen.getByText('Регистрация');

    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');

    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});
