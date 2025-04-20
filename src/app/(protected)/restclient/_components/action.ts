'use server';

import { ContentRequest } from './Content';

export async function sendRequest(data: ContentRequest) {
  if (!data.url) {
    return {
      error: 'URL is required',
    };
  }

  try {
    const url = data.url;
    const body = data.body || null;

    const headers = data.headers
      ? Object.fromEntries(data.headers.filter((h) => h.isActive && h.name).map((h) => [h.name, h.value]))
      : {};

    console.log('Server received request with URL:', url);
    console.log('Request headers:', headers);

    const response = await fetch(url, {
      method: data.method || 'GET',
      headers,
      body,
    });

    const responseData = await response.json();
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
    };
  } catch (error) {
    console.error('Error sending request:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to send request',
    };
  }
}
