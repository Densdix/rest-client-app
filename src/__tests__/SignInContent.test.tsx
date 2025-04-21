import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInContent from '@/app/(auth)/signin/_components/Content';

vi.mock('@/app/(auth)/signin/actions', () => ({
  login: vi.fn(),
}));

import { login } from '@/app/(auth)/signin/actions';

describe('SignInContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает форму входа', () => {
    render(<SignInContent />);

    expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Еще не зарегистрированы? Регистрация')).toBeInTheDocument();
  });

  it('отображает ошибки валидации при неверном вводе', async () => {
    render(<SignInContent />);

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Пароль обязателен')).toBeInTheDocument();
    });
  });

  it('отображает ошибку валидации для слишком короткого пароля', async () => {
    render(<SignInContent />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: '12345' } });

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('Пароль должен содержать минимум 6 символов')).toBeInTheDocument();
    });
  });

  it('вызывает функцию login при отправке формы с корректными данными', async () => {
    (login as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null });

    render(<SignInContent />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();

      const formDataArg = (login as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(formDataArg instanceof FormData).toBe(true);
    });
  });

  it('отображает ошибку при неудачном входе', async () => {
    (login as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Invalid credentials' });

    render(<SignInContent />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('Ошибка при входе. Проверьте email и пароль.')).toBeInTheDocument();
    });
  });
});
