'use server';

import { ContentRequest } from './Content';

export async function sendRequest(data: ContentRequest) {
  if (!data.url) {
    return {
      error: 'URL is required',
    };
  }

  try {
    const response = await fetch(data.url, {
      method: data.method || 'GET',
      headers: data.headers
        ? Object.fromEntries(data.headers.filter((h) => h.isActive && h.name).map((h) => [h.name, h.value]))
        : {},
      body: data.body ? data.body : null,
    });

    const responseData = await response.json();
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to send request',
    };
  }
}
