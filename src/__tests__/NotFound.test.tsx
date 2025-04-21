import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';

describe('NotFound', () => {
  it('отображает сообщение 404 и текст о ненайденной странице', () => {
    render(<NotFound />);

    // Проверяем наличие заголовка 404
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404')).toHaveClass('text-4xl');
    expect(screen.getByText('404')).toHaveClass('font-bold');

    // Проверяем наличие сообщения о ненайденной странице
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
    expect(screen.getByText('Страница не найдена')).toHaveClass('text-xl');
  });
});
