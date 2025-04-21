import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryParamsBlock } from '@/app/(protected)/restclient/_components/QueryParamsBlock';
import { Control } from 'react-hook-form';
import { ContentRequest } from '@/app/(protected)/restclient/_components/Content';

describe('QueryParamsBlock', () => {
  const mockRegister = vi.fn();
  const mockSetValue = vi.fn();
  const mockAppend = vi.fn();
  const mockRemove = vi.fn();
  const mockHandleAppend = vi.fn();
  const mockCreateUrl = vi.fn();
  const mockControl = {} as Control<ContentRequest>;
  const mockGetValues = vi.fn();

  // Подготовка мок-данных для полей запроса
  const mockFields = [
    { id: '1', name: 'page', value: '1', isActive: true },
    { id: '2', name: 'limit', value: '10', isActive: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockReturnValue({});
  });

  it('отображает блок Query Params с заголовком и полями', () => {
    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    expect(screen.getByText('Query Params')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('вызывает register для каждого поля параметров', () => {
    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    expect(mockRegister).toHaveBeenCalledWith('paramNames.0.isActive');
    expect(mockRegister).toHaveBeenCalledWith('paramNames.0.name');
    expect(mockRegister).toHaveBeenCalledWith('paramNames.0.value');
    expect(mockRegister).toHaveBeenCalledWith('paramNames.1.isActive');
    expect(mockRegister).toHaveBeenCalledWith('paramNames.1.name');
    expect(mockRegister).toHaveBeenCalledWith('paramNames.1.value');
  });

  it('вызывает createUrl при изменении состояния активности параметра', () => {
    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockSetValue).toHaveBeenCalledWith('paramNames.0.isActive', expect.any(Boolean));
    expect(mockCreateUrl).toHaveBeenCalled();
  });

  it('вызывает handleAppend при изменении имени параметра', () => {
    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    // Находим поля ввода (третье поле - это имя первого параметра)
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'newParam' } });

    expect(mockSetValue).toHaveBeenCalledWith('paramNames.0.name', 'newParam');
    expect(mockHandleAppend).toHaveBeenCalled();
  });

  it('вызывает remove и createUrl при удалении параметра', () => {
    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={mockFields}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockRemove).toHaveBeenCalledWith(0);
    expect(mockCreateUrl).toHaveBeenCalled();
  });

  it('не вызывает remove, если поле только одно', () => {
    const singleField = [{ id: '1', name: 'page', value: '1', isActive: true }];

    render(
      <QueryParamsBlock
        register={mockRegister}
        control={mockControl}
        setValue={mockSetValue}
        getValues={mockGetValues}
        fields={singleField}
        append={mockAppend}
        remove={mockRemove}
        handleAppend={mockHandleAppend}
        createUrl={mockCreateUrl}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
