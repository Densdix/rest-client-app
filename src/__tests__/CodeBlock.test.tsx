import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeBlock } from '@/app/(protected)/restclient/_components/CodeBlock';

vi.mock('@/utils/generateRequestCode', () => ({
  generateRequestCode: vi.fn((data) => {
    if (!data.url) {
      return 'Not enough data to generate code.';
    }

    return {
      curl: `curl -X ${data.method || 'GET'} "${data.url}"`,
      jsFetch: `fetch("${data.url}")`,
      jsXHR: `var xhr = new XMLHttpRequest(); xhr.open("${data.method || 'GET'}", "${data.url}");`,
      node: `const https = require('https'); const req = https.request("${data.url}");`,
      py: `import requests\nrequests.request("${data.method || 'GET'}", "${data.url}")`,
      java: `URL url = new URL("${data.url}"); HttpURLConnection con = (HttpURLConnection) url.openConnection();`,
      csharp: `var client = new HttpClient(); var request = new HttpRequestMessage(HttpMethod.${data.method || 'Get'}, "${data.url}");`,
      go: `http.NewRequest("${data.method || 'GET'}", "${data.url}", nil)`,
    };
  }),
}));

describe('CodeBlock', () => {
  const mockGetValues = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает заголовок блока', () => {
    mockGetValues.mockReturnValue({
      url: 'https://api.example.com',
      method: 'GET',
    });

    render(<CodeBlock getValues={mockGetValues} />);
    expect(screen.getByText('Generated request code')).toBeInTheDocument();
  });

  it('отображает сообщение, если недостаточно данных для генерации кода', () => {
    mockGetValues.mockReturnValue({});

    render(<CodeBlock getValues={mockGetValues} />);
    expect(screen.getByText('Not enough data to generate code.')).toBeInTheDocument();
  });

  it('отображает вкладки для разных языков программирования', () => {
    mockGetValues.mockReturnValue({
      url: 'https://api.example.com',
      method: 'GET',
    });

    render(<CodeBlock getValues={mockGetValues} />);

    expect(screen.getByText('cURL')).toBeInTheDocument();
    expect(screen.getByText('JavaScript (Fetch)')).toBeInTheDocument();
    expect(screen.getByText('JavaScript (XHR)')).toBeInTheDocument();
    expect(screen.getByText('NodeJS')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('C#')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('по умолчанию отображает код для cURL', () => {
    mockGetValues.mockReturnValue({
      url: 'https://api.example.com',
      method: 'GET',
    });

    render(<CodeBlock getValues={mockGetValues} />);

    expect(screen.getByText('curl -X GET "https://api.example.com"')).toBeInTheDocument();
  });

  it('переключает отображаемый код при клике на вкладку', () => {
    mockGetValues.mockReturnValue({
      url: 'https://api.example.com',
      method: 'GET',
    });

    render(<CodeBlock getValues={mockGetValues} />);

    expect(screen.getByText('curl -X GET "https://api.example.com"')).toBeInTheDocument();

    fireEvent.click(screen.getByText('JavaScript (Fetch)'));

    expect(screen.getByText('fetch("https://api.example.com")')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Python'));

    expect(screen.getByText(/import requests/)).toBeInTheDocument();
    expect(screen.getByText(/requests.request\("GET", "https:\/\/api.example.com"\)/)).toBeInTheDocument();
  });
});
