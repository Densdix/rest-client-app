import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Content, ContentRequest } from '@/app/(protected)/restclient/_components/Content';
import { UseFormRegister } from 'react-hook-form';

vi.mock('@/utils/localstorage/recordRequest', () => ({
  recordRequest: vi.fn(),
}));

vi.mock('@/app/(protected)/restclient/_components/action', () => ({
  sendRequest: vi.fn().mockImplementation(async (data) => {
    if (!data.url) {
      return { error: 'URL is required' };
    }

    if (data.url.includes('error')) {
      return { error: 'Failed to fetch' };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      data: { success: true, message: 'OK' },
    };
  }),
}));

vi.mock('@/app/(protected)/restclient/_components/UrlBlock', () => ({
  UrlBlock: ({ register }: { register: UseFormRegister<ContentRequest> }) => (
    <div data-testid="url-block">
      <select {...register('method')} data-testid="method-select">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
      </select>
      <input {...register('url')} data-testid="url-input" />
      <button type="submit">Send</button>
    </div>
  ),
}));

vi.mock('@/app/(protected)/restclient/_components/QueryParamsBlock', () => ({
  QueryParamsBlock: () => <div data-testid="query-params-block">Query Params Block</div>,
}));

vi.mock('@/app/(protected)/restclient/_components/HeadersBlock', () => ({
  HeadersBlock: () => <div data-testid="headers-block">Headers Block</div>,
}));

vi.mock('@/app/(protected)/restclient/_components/RequestBodyBlock', () => ({
  RequestBodyBlock: ({ register }: { register: UseFormRegister<ContentRequest> }) => (
    <div data-testid="request-body-block">
      <textarea {...register('body')} data-testid="body-textarea" />
    </div>
  ),
}));

vi.mock('@/app/(protected)/restclient/_components/ResponseBlock', () => ({
  ResponseBlock: ({
    responseData,
    error,
    responseStatus,
  }: {
    responseData: string | null;
    error: string | null;
    responseStatus?: number;
  }) => (
    <div data-testid="response-block">
      {responseStatus && <div>Status: {responseStatus}</div>}
      {responseData && <div data-testid="response-data">{JSON.stringify(responseData)}</div>}
      {error && <div data-testid="response-error">{error}</div>}
    </div>
  ),
}));

vi.mock('@/app/(protected)/restclient/_components/CodeBlock', () => ({
  CodeBlock: () => <div data-testid="code-block">Code Block</div>,
}));

vi.mock('@/utils/localstorage/variablesLocal', () => ({
  getVariablesFromStorage: vi.fn().mockReturnValue([{ id: '1', name: 'API_URL', value: 'https://api.example.com' }]),
  replaceVariables: vi.fn((text) => text),
}));

describe('Content Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('рендерит все дочерние компоненты', () => {
    render(<Content />);

    expect(screen.getByTestId('url-block')).toBeInTheDocument();
    expect(screen.getByTestId('query-params-block')).toBeInTheDocument();
    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.getByTestId('request-body-block')).toBeInTheDocument();
    expect(screen.getByTestId('response-block')).toBeInTheDocument();
    expect(screen.getByTestId('code-block')).toBeInTheDocument();
  });

  it('загружает запрос из локального хранилища при наличии', async () => {
    const savedRequest: ContentRequest = {
      url: 'https://api.example.com/test',
      method: 'POST',
      body: '{"test": true}',
      headers: [{ name: 'Content-Type', value: 'application/json', isActive: true }],
      paramNames: [],
    };

    localStorage.setItem('currentRequest', JSON.stringify(savedRequest));

    render(<Content />);

    await waitFor(() => {
      const urlInput = screen.getByTestId('url-input');
      expect(urlInput).toHaveValue('https://api.example.com/test');
    });
  });
});
