import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInContent from '@/app/(auth)/signin/_components/Content';

// Мок для actions.ts
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

    // Проверяем наличие всех элементов формы
    expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Еще не зарегистрированы? Регистрация')).toBeInTheDocument();
  });

  it('отображает ошибки валидации при неверном вводе', async () => {
    render(<SignInContent />);

    // Нажимаем кнопку входа без заполнения полей
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что появились сообщения об ошибках
    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Пароль обязателен')).toBeInTheDocument();
    });
  });

  it('отображает ошибку валидации для слишком короткого пароля', async () => {
    render(<SignInContent />);

    // Вводим корректный email, но слишком короткий пароль
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: '12345' } });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Пароль должен содержать минимум 6 символов')).toBeInTheDocument();
    });
  });

  it('вызывает функцию login при отправке формы с корректными данными', async () => {
    // Настройка мока для успешного входа
    (login as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null });

    render(<SignInContent />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что функция login была вызвана
    await waitFor(() => {
      expect(login).toHaveBeenCalled();

      // Проверяем что был создан FormData объект с правильными данными
      const formDataArg = (login as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(formDataArg instanceof FormData).toBe(true);
    });
  });

  it('отображает ошибку при неудачном входе', async () => {
    // Настройка мока для неудачного входа
    (login as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Invalid credentials' });

    render(<SignInContent />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Ошибка при входе. Проверьте email и пароль.')).toBeInTheDocument();
    });
  });
});
