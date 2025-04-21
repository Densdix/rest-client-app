import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeadersBlock } from '@/app/(protected)/restclient/_components/HeadersBlock';
import { Control } from 'react-hook-form';
import { ContentRequest } from '@/app/(protected)/restclient/_components/Content';

describe('HeadersBlock', () => {
  const mockRegister = vi.fn();
  const mockSetValue = vi.fn();
  const mockAppend = vi.fn();
  const mockRemove = vi.fn();
  const mockHandleAppendHeader = vi.fn();
  const mockControl = {} as Control<ContentRequest>;

  const mockFields = [
    { id: '1', name: 'Content-Type', value: 'application/json', isActive: true },
    { id: '2', name: 'Authorization', value: 'Bearer token123', isActive: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockReturnValue({});
  });

  it('отображает блок заголовков с заголовком и полями', () => {
    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Header name')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Header value')).toHaveLength(2);
  });

  it('вызывает register для каждого поля заголовка', () => {
    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    expect(mockRegister).toHaveBeenCalledWith('headers.0.isActive');
    expect(mockRegister).toHaveBeenCalledWith('headers.0.name');
    expect(mockRegister).toHaveBeenCalledWith('headers.0.value');
    expect(mockRegister).toHaveBeenCalledWith('headers.1.isActive');
    expect(mockRegister).toHaveBeenCalledWith('headers.1.name');
    expect(mockRegister).toHaveBeenCalledWith('headers.1.value');
  });

  it('вызывает handleAppendHeader при изменении имени заголовка', () => {
    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    const nameInputs = screen.getAllByPlaceholderText('Header name');
    fireEvent.change(nameInputs[0], { target: { value: 'New-Header' } });

    expect(mockSetValue).toHaveBeenCalledWith('headers.0.name', 'New-Header');
    expect(mockHandleAppendHeader).toHaveBeenCalled();
  });

  it('вызывает handleAppendHeader при изменении значения заголовка', () => {
    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    const valueInputs = screen.getAllByPlaceholderText('Header value');
    fireEvent.change(valueInputs[0], { target: { value: 'new-value' } });

    expect(mockSetValue).toHaveBeenCalledWith('headers.0.value', 'new-value');
    expect(mockHandleAppendHeader).toHaveBeenCalled();
  });

  it('вызывает remove при нажатии на кнопку удаления', () => {
    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('не вызывает remove, если поле только одно', () => {
    const singleField = [{ id: '1', name: 'Content-Type', value: 'application/json', isActive: true }];

    render(
      <HeadersBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        fields={singleField}
        append={mockAppend}
        remove={mockRemove}
        handleAppendHeader={mockHandleAppendHeader}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
