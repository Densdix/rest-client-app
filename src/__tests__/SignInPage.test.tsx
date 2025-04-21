import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignInPage from '@/app/(auth)/signin/page';

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

vi.mock('@/app/(auth)/signin/_components/Content', () => ({
  default: () => <div data-testid="sign-in-content">Sign In Content</div>,
}));

describe('SignInPage Component', () => {
  it('отображает компонент SignInContent', async () => {
    render(await SignInPage());
    expect(screen.getByTestId('sign-in-content')).toBeInTheDocument();
  });

  it('имеет правильное оформление', async () => {
    render(await SignInPage());
    const container = screen.getByTestId('sign-in-content').parentElement;
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('h-full');
  });
});
