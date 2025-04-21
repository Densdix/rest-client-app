import React from 'react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { render } from '@testing-library/react';
import { Header } from '../components/Header';
import * as supabaseServer from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

vi.mock('../components/ClientHeader', () => ({
  ClientHeader: ({ user }: { user: User | null }) => (
    <div data-testid="client-header">{user ? `User: ${user.email}` : 'No user'}</div>
  ),
}));

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Header', () => {
  it('передает пользователя в ClientHeader компонент когда пользователь авторизован', async () => {
    const mockUser = { email: 'test@example.com' };
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
        }),
      },
    };

    (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

    const { findByTestId } = render(await Header());

    const clientHeader = await findByTestId('client-header');
    expect(clientHeader.textContent).toBe(`User: ${mockUser.email}`);
  });

  it('передает null в ClientHeader компонент когда пользователь не авторизован', async () => {
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    };

    (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

    const { findByTestId } = render(await Header());

    const clientHeader = await findByTestId('client-header');
    expect(clientHeader.textContent).toBe('No user');
  });
});
