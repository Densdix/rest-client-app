import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UrlBlock } from '@/app/(protected)/restclient/_components/UrlBlock';

// Мок для variablesLocal
vi.mock('@/utils/localstorage/variablesLocal', () => ({
  replaceVariables: vi.fn((url) => url.replace(/\{\{([^}]+)\}\}/g, 'replaced_value')),
}));

describe('UrlBlock', () => {
  const mockRegister = vi.fn();
  const mockGetValues = vi.fn();
  const mockVariables = [{ id: '1', name: 'API_KEY', value: '12345' }];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockReturnValue({});
  });

  it('отображает блок URL с полями ввода', () => {
    mockGetValues.mockReturnValue('https://api.example.com');

    render(<UrlBlock register={mockRegister} getValues={mockGetValues} isMounted={true} variables={mockVariables} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument(); // select для HTTP метода
    expect(screen.getByPlaceholderText('Enter request URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  it('показывает предпросмотр URL с переменными', () => {
    mockGetValues.mockReturnValue('https://api.example.com/{{API_KEY}}/users');

    render(<UrlBlock register={mockRegister} getValues={mockGetValues} isMounted={true} variables={mockVariables} />);

    expect(screen.getByText(/URL с переменными:/i)).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/replaced_value/users')).toBeInTheDocument();
  });

  it('не показывает предпросмотр URL, если нет переменных', () => {
    mockGetValues.mockReturnValue('https://api.example.com/users');

    render(<UrlBlock register={mockRegister} getValues={mockGetValues} isMounted={true} variables={[]} />);

    expect(screen.queryByText(/URL с переменными:/i)).not.toBeInTheDocument();
  });

  it('не показывает предпросмотр URL, если компонент не смонтирован', () => {
    mockGetValues.mockReturnValue('https://api.example.com/{{API_KEY}}/users');

    render(<UrlBlock register={mockRegister} getValues={mockGetValues} isMounted={false} variables={mockVariables} />);

    expect(screen.queryByText(/URL с переменными:/i)).not.toBeInTheDocument();
  });

  it('регистрирует поля формы', () => {
    mockGetValues.mockReturnValue('');

    render(<UrlBlock register={mockRegister} getValues={mockGetValues} isMounted={true} variables={[]} />);

    expect(mockRegister).toHaveBeenCalledWith('method');
    expect(mockRegister).toHaveBeenCalledWith('url');
  });
});
