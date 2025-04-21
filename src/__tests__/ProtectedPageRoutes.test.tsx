import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render } from '@testing-library/react';
import RestClientPage from '../app/(protected)/restclient/page';
import HistoryPage from '../app/(protected)/history/page';
import VariablesPage from '../app/(protected)/variables/page';
import * as supabaseServer from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Мок для createClient и Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Мок для next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Моки для компонентов контента
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
      // Устанавливаем мок для неавторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      await RestClientPage();

      // Проверяем, что был вызван редирект на страницу входа
      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент Content, если пользователь аутентифицирован', async () => {
      // Устанавливаем мок для авторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      const result = await RestClientPage();
      const { container } = render(result);

      // Проверяем, что компонент Content отрендерен
      expect(container.innerHTML).toContain('REST Client Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('HistoryPage', () => {
    it('перенаправляет на страницу входа, если пользователь не аутентифицирован', async () => {
      // Устанавливаем мок для неавторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      await HistoryPage();

      // Проверяем, что был вызван редирект на страницу входа
      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент HistoryClientWrapper, если пользователь аутентифицирован', async () => {
      // Устанавливаем мок для авторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      const result = await HistoryPage();
      const { container } = render(result);

      // Проверяем, что компонент HistoryClientWrapper отрендерен
      expect(container.innerHTML).toContain('History Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('VariablesPage', () => {
    it('перенаправляет на страницу входа, если пользователь не аутентифицирован', async () => {
      // Устанавливаем мок для неавторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      await VariablesPage();

      // Проверяем, что был вызван редирект на страницу входа
      expect(redirect).toHaveBeenCalledWith('/signin');
    });

    it('отображает компонент VariablesClientWrapper, если пользователь аутентифицирован', async () => {
      // Устанавливаем мок для авторизованного пользователя
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
          }),
        },
      };

      (supabaseServer.createClient as Mock).mockResolvedValue(mockSupabaseClient);

      // Рендерим компонент
      const result = await VariablesPage();
      const { container } = render(result);

      // Проверяем, что компонент VariablesClientWrapper отрендерен
      expect(container.innerHTML).toContain('Variables Content');
      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
