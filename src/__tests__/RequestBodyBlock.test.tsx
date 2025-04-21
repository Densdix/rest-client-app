import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequestBodyBlock } from '@/app/(protected)/restclient/_components/RequestBodyBlock';

describe('RequestBodyBlock', () => {
  const mockRegister = vi.fn();

  const mockVariables = [
    { id: '1', name: 'API_KEY', value: '12345' },
    { id: '2', name: 'USER_ID', value: 'user_123' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockReturnValue({});
  });

  it('отображает блок Request Body с текстовой областью', () => {
    render(<RequestBodyBlock register={mockRegister} variables={[]} isMounted={true} />);

    expect(screen.getByText('Request Body')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter request body')).toBeInTheDocument();
  });

  it('вызывает register для текстовой области тела запроса', () => {
    render(<RequestBodyBlock register={mockRegister} variables={[]} isMounted={true} />);

    expect(mockRegister).toHaveBeenCalledWith('body');
  });

  it('не отображает информацию о переменных, если нет переменных', () => {
    render(<RequestBodyBlock register={mockRegister} variables={[]} isMounted={true} />);

    expect(screen.queryByText(/Вы можете использовать переменные/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Доступные переменные:/)).not.toBeInTheDocument();
  });

  it('не отображает информацию о переменных, если компонент не смонтирован', () => {
    render(<RequestBodyBlock register={mockRegister} variables={mockVariables} isMounted={false} />);

    expect(screen.queryByText(/Вы можете использовать переменные/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Доступные переменные:/)).not.toBeInTheDocument();
  });

  it('отображает информацию о доступных переменных, если они есть и компонент смонтирован', () => {
    render(<RequestBodyBlock register={mockRegister} variables={mockVariables} isMounted={true} />);

    expect(screen.getByText(/Вы можете использовать переменные/)).toBeInTheDocument();
    expect(screen.getByText(/Доступные переменные:/)).toBeInTheDocument();
    expect(screen.getByText(/\{\{API_KEY\}\}/)).toBeInTheDocument();
    expect(screen.getByText(/\{\{USER_ID\}\}/)).toBeInTheDocument();
  });
});
