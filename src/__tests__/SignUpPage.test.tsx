import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUpPage from '@/app/(auth)/signup/page';

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

vi.mock('@/app/(auth)/signup/_components/Content', () => ({
  default: () => <div data-testid="sign-up-content">Sign Up Content</div>,
}));

describe('SignUpPage Component', () => {
  it('отображает компонент SignUpContent', async () => {
    render(await SignUpPage());
    expect(screen.getByTestId('sign-up-content')).toBeInTheDocument();
  });

  it('имеет правильное оформление', async () => {
    render(await SignUpPage());
    const container = screen.getByTestId('sign-up-content').parentElement;
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('h-full');
  });
});
