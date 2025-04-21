import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VariablesComponent } from '@/app/(protected)/variables/_components/VariablesComponent';

vi.mock('@/utils/localstorage/variablesLocal', () => ({
  getVariablesFromStorage: vi.fn(),
  addVariable: vi.fn((name, value) => ({
    id: 'new-id',
    name,
    value,
  })),
  updateVariable: vi.fn((id, name, value) => ({
    id,
    name,
    value,
  })),
  deleteVariable: vi.fn(),
}));

import {
  getVariablesFromStorage,
  addVariable,
  updateVariable,
  deleteVariable,
} from '@/utils/localstorage/variablesLocal';

describe('VariablesComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getVariablesFromStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      { id: '1', name: 'API_URL', value: 'https://api.example.com' },
      { id: '2', name: 'API_KEY', value: '12345' },
    ]);
  });

  it('отображает список существующих переменных', () => {
    render(<VariablesComponent />);

    expect(screen.getByText('Переменные')).toBeInTheDocument();
    expect(screen.getByText('API_URL')).toBeInTheDocument();
    expect(screen.getByText('API_KEY')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('отображает форму для добавления новой переменной', () => {
    render(<VariablesComponent />);

    expect(screen.getByText('Добавить новую переменную')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя переменной')).toBeInTheDocument();
    expect(screen.getByLabelText('Значение')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });

  it('отображает сообщение, если нет переменных', () => {
    (getVariablesFromStorage as ReturnType<typeof vi.fn>).mockReturnValue([]);
    render(<VariablesComponent />);

    expect(screen.getByText('Нет сохраненных переменных')).toBeInTheDocument();
  });

  it('добавляет новую переменную при отправке формы', async () => {
    render(<VariablesComponent />);

    fireEvent.change(screen.getByLabelText('Имя переменной'), {
      target: { value: 'NEW_VAR' },
    });
    fireEvent.change(screen.getByLabelText('Значение'), {
      target: { value: 'new-value' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    await waitFor(() => {
      expect(addVariable).toHaveBeenCalledWith('NEW_VAR', 'new-value');
    });

    expect(screen.getByText('NEW_VAR')).toBeInTheDocument();
    expect(screen.getByText('new-value')).toBeInTheDocument();
  });

  it('редактирует существующую переменную', async () => {
    render(<VariablesComponent />);

    const editButtons = screen.getAllByText('Редактировать');
    fireEvent.click(editButtons[0]);

    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();

    const nameInput = screen.getByLabelText('Имя переменной');
    const valueInput = screen.getByLabelText('Значение');

    expect(nameInput).toHaveValue('API_URL');
    expect(valueInput).toHaveValue('https://api.example.com');

    fireEvent.change(valueInput, {
      target: { value: 'https://new-api.example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(updateVariable).toHaveBeenCalledWith('1', 'API_URL', 'https://new-api.example.com');
    });
  });

  it('удаляет переменную', async () => {
    render(<VariablesComponent />);

    const deleteButtons = screen.getAllByText('Удалить');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteVariable).toHaveBeenCalledWith('1');
    });

    expect(screen.queryByText('API_URL')).not.toBeInTheDocument();
  });

  it('отменяет редактирование переменной', () => {
    render(<VariablesComponent />);

    const editButtons = screen.getAllByText('Редактировать');
    fireEvent.click(editButtons[0]);

    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Сохранить' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Отмена' })).not.toBeInTheDocument();
  });

  it('показывает ошибку, если имя переменной пустое', async () => {
    render(<VariablesComponent />);

    fireEvent.change(screen.getByLabelText('Имя переменной'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Значение'), {
      target: { value: 'some-value' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    await waitFor(() => {
      expect(screen.getByText('Имя переменной не может быть пустым')).toBeInTheDocument();
    });
  });

  it('показывает ошибку, если переменная с таким именем уже существует', async () => {
    render(<VariablesComponent />);

    fireEvent.change(screen.getByLabelText('Имя переменной'), {
      target: { value: 'API_URL' },
    });
    fireEvent.change(screen.getByLabelText('Значение'), {
      target: { value: 'new-value' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    await waitFor(() => {
      expect(screen.getByText('Переменная с именем API_URL уже существует')).toBeInTheDocument();
    });
  });
});
