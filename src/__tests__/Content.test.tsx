import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpContent from '../app/(auth)/signup/_components/Content';
import * as actions from '../app/(auth)/signup/actions';

vi.mock('../app/(auth)/signup/actions', () => ({
  signup: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('SignUpContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('показывает ошибки валидации при отправке пустой формы', async () => {
    render(<SignUpContent />);

    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/Пароль обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/Подтверждение пароля обязательно/i)).toBeInTheDocument();
    });
  });

  it('показывает ошибку при коротком пароле', async () => {
    render(<SignUpContent />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Пароль$/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Пароль должен содержать минимум 6 символов/i)).toBeInTheDocument();
    });
  });

  it('показывает ошибку при несовпадении паролей', async () => {
    render(<SignUpContent />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Пароль$/i);
    const confirmPasswordInput = screen.getByLabelText(/Подтвердите пароль/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'другойпароль' } });

    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Пароли не совпадают/i)).toBeInTheDocument();
    });
  });

  it('вызывает функцию signup при отправке валидной формы', async () => {
    vi.mocked(actions.signup).mockResolvedValue({ error: '' });

    render(<SignUpContent />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Пароль$/i);
    const confirmPasswordInput = screen.getByLabelText(/Подтвердите пароль/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(actions.signup).toHaveBeenCalled();
      const formData = vi.mocked(actions.signup).mock.calls[0][0];
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('password')).toBe('password123');
      expect(formData.get('confirmPassword')).toBe('password123');
    });
  });

  it('показывает ошибку сервера при неудачной регистрации', async () => {
    vi.mocked(actions.signup).mockResolvedValue({ error: 'Пользователь с таким email уже существует' });

    render(<SignUpContent />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Пароль$/i);
    const confirmPasswordInput = screen.getByLabelText(/Подтвердите пароль/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Пользователь с таким email уже существует/i)).toBeInTheDocument();
    });
  });
});
