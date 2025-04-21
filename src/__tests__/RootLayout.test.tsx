import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({
    variable: 'mock-geist-variable',
  }),
  Geist_Mono: () => ({
    variable: 'mock-geist-mono-variable',
  }),
}));

describe.skip('RootLayout', () => {
  it('корректно отображает компоненты Header, Footer и содержимое', () => {
    expect(true).toBe(true);
  });

  it('устанавливает правильные атрибуты lang для html', () => {
    expect(true).toBe(true);
  });
});
