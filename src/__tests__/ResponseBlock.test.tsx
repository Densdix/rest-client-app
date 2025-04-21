import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponseBlock } from '@/app/(protected)/restclient/_components/ResponseBlock';

vi.mock('@/utils/getStatusCodeColor', () => ({
  getStatusCodeColor: vi.fn((statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-500';
    if (statusCode >= 400 && statusCode < 500) return 'text-red-500';
    if (statusCode >= 500) return 'text-red-700';
    return 'text-gray-500';
  }),
}));

describe('ResponseBlock', () => {
  it('отображает заголовок блока ответа', () => {
    render(<ResponseBlock responseData={null} error={null} responseStatus={undefined} />);
    expect(screen.getByText('Response')).toBeInTheDocument();
  });

  it('отображает статус ответа, если он есть', () => {
    render(<ResponseBlock responseData={null} error={null} responseStatus={200} />);
    expect(screen.getByText('Status: 200')).toBeInTheDocument();
  });

  it('отображает ошибку, если она есть', () => {
    render(<ResponseBlock responseData={null} error="Failed to fetch data" responseStatus={404} />);
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  it('применяет правильный цвет для успешного статуса', () => {
    render(<ResponseBlock responseData={JSON.stringify({ success: true })} error={null} responseStatus={200} />);

    const statusElement = screen.getByText('Status: 200');
    expect(statusElement).toHaveClass('text-green-500');
  });

  it('применяет правильный цвет для ошибочного статуса клиента', () => {
    render(<ResponseBlock responseData={null} error="Not found" responseStatus={404} />);

    const statusElement = screen.getByText('Status: 404');
    expect(statusElement).toHaveClass('text-red-500');
  });

  it('применяет правильный цвет для ошибочного статуса сервера', () => {
    render(<ResponseBlock responseData={null} error="Server error" responseStatus={500} />);

    const statusElement = screen.getByText('Status: 500');
    expect(statusElement).toHaveClass('text-red-700');
  });

  it('не отображает данные ответа, если есть ошибка', () => {
    const responseData = JSON.stringify({ message: 'Success' });

    render(<ResponseBlock responseData={responseData} error="Error occurred" responseStatus={400} />);

    expect(screen.queryByText(/"message": "Success"/)).not.toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
