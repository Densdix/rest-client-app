import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render } from '@testing-library/react';
import RestClientPage from '../app/(protected)/restclient/page';
import HistoryPage from '../app/(protected)/history/page';
import VariablesPage from '../app/(protected)/variables/page';
import * as supabaseServer from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('../app/(protected)/restclient/_components/Content', () => ({
  Content: () => <div data-testid="rest-client-content">REST Client Content</div>,
}));

vi.mock('../app/(protected)/history/ClientComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="history-client-wrapper">History Content</div>,
}));

vi.mock('../app/(protected)/variables/ClientComponent', () => ({
  VariablesClientWrapper: () => <div data-testid="variables-client-wrapper">Variables Content</div>,
}));

describe('Защищенные страницы', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RestClientPage', () => {
    it('перенаправляет на страницу входа, если пользователь не аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      await RestClientPage();

      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент Content, если пользователь аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      const result = await RestClientPage();
      const { container } = render(result);

      expect(container.innerHTML).toContain('REST Client Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('HistoryPage', () => {
    it('перенаправляет на страницу входа, если пользователь не аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      await HistoryPage();

      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент HistoryClientWrapper, если пользователь аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      const result = await HistoryPage();
      const { container } = render(result);

      expect(container.innerHTML).toContain('History Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('VariablesPage', () => {
    it('перенаправляет на страницу входа, если пользователь не аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      await VariablesPage();

      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент VariablesClientWrapper, если пользователь аутентифицирован', async () => {
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      const result = await VariablesPage();
      const { container } = render(result);

      expect(container.innerHTML).toContain('Variables Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
