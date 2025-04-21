import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Footer';

// Мок для Next.js Image компонента
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

describe('Footer', () => {
  it('отображает ссылки на GitHub профили разработчиков', () => {
    render(<Footer />);

    // Проверяем наличие ссылок на GitHub профили
    const gitHubLinks = screen.getAllByAltText('github logo');
    expect(gitHubLinks).toHaveLength(3);

    expect(screen.getByText('densdix')).toBeInTheDocument();
    expect(screen.getByText('evakerrigan')).toBeInTheDocument();
    expect(screen.getByText('teymurdev')).toBeInTheDocument();
  });

  it('отображает ссылку на RS School', () => {
    render(<Footer />);

    // Проверяем наличие ссылки на RS School
    const rsSchoolLogo = screen.getByAltText('RSS School JS logo');
    expect(rsSchoolLogo).toBeInTheDocument();

    const rsSchoolLink = rsSchoolLogo.closest('a');
    expect(rsSchoolLink).toHaveAttribute('href', 'https://rs.school');
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
  });

  it('отображает год в футере', () => {
    render(<Footer />);

    // Проверяем наличие года
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
});
