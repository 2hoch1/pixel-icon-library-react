import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PixelIcon } from '@/PixelIcon';

vi.mock('@/dynamicIconImports', async () => {
  const React = await import('react');
  const MockIcon = ({
    title: _title,
    ...props
  }: React.SVGProps<SVGSVGElement> & { title?: string }) =>
    React.createElement('svg', { 'data-testid': 'mock-icon', ...props });
  return {
    default: {
      heart: () => Promise.resolve({ default: MockIcon }),
      'star-solid': () => Promise.resolve({ default: MockIcon }),
    },
  };
});

describe('PixelIcon', () => {
  it('renders null while loading with no fallback', () => {
    const { container } = render(<PixelIcon name="heart" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the fallback node while loading', () => {
    render(<PixelIcon name="heart" fallback={<span>Loading</span>} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the icon after async loading', async () => {
    render(<PixelIcon name="heart" />);
    await waitFor(() => expect(screen.getByTestId('mock-icon')).toBeInTheDocument());
  });

  it('applies default size of 24px', async () => {
    render(<PixelIcon name="heart" />);
    await waitFor(() => {
      const svg = screen.getByTestId('mock-icon');
      expect(svg).toHaveAttribute('width', '24px');
      expect(svg).toHaveAttribute('height', '24px');
    });
  });

  it('applies custom numeric size', async () => {
    render(<PixelIcon name="heart" size={48} />);
    await waitFor(() => {
      const svg = screen.getByTestId('mock-icon');
      expect(svg).toHaveAttribute('width', '48px');
      expect(svg).toHaveAttribute('height', '48px');
    });
  });

  it('applies custom string size', async () => {
    render(<PixelIcon name="heart" size="2rem" />);
    await waitFor(() => {
      const svg = screen.getByTestId('mock-icon');
      expect(svg).toHaveAttribute('width', '2rem');
      expect(svg).toHaveAttribute('height', '2rem');
    });
  });

  it('sets role="img" by default', async () => {
    render(<PixelIcon name="heart" />);
    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());
  });

  it('uses name as aria-label when title is absent', async () => {
    render(<PixelIcon name="heart" />);
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'heart');
    });
  });

  it('uses title as aria-label when provided', async () => {
    render(<PixelIcon name="heart" title="Favorite" />);
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Favorite');
    });
  });

  it('resolves an icon whose name ends in -solid', async () => {
    render(<PixelIcon name="star-solid" />);
    await waitFor(() => expect(screen.getByTestId('mock-icon')).toBeInTheDocument());
  });

  it('renders fallback for unknown icon name', () => {
    render(<PixelIcon name={'nonexistent' as never} fallback={<span>Not found</span>} />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('forwards className to the icon', async () => {
    render(<PixelIcon name="heart" className="my-icon" />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-icon')).toHaveClass('my-icon');
    });
  });
});
