import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DynamicPixelIcon } from '../src/DynamicPixelIcon';

vi.mock('../src/dynamicIconImports', async () => {
  const React = await import('react');
  const MockIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) =>
    React.createElement('svg', { 'data-testid': 'mock-icon', ...props });
  return {
    default: {
      heart: () => Promise.resolve({ default: MockIcon }),
      'star-solid': () => Promise.resolve({ default: MockIcon }),
    },
  };
});

describe('DynamicPixelIcon', () => {
  it('renders the fallback while loading', () => {
    render(<DynamicPixelIcon name="heart" fallback={<span>Loading</span>} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the icon after suspense resolves', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" />);
    });
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('applies default size of 24px', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" />);
    });
    const svg = screen.getByTestId('mock-icon');
    expect(svg).toHaveAttribute('width', '24px');
    expect(svg).toHaveAttribute('height', '24px');
  });

  it('applies custom numeric size', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" size={48} />);
    });
    const svg = screen.getByTestId('mock-icon');
    expect(svg).toHaveAttribute('width', '48px');
    expect(svg).toHaveAttribute('height', '48px');
  });

  it('sets role="img" and aria-label from name', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" />);
    });
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'heart');
  });

  it('uses title as aria-label when provided', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" title="Favorite" />);
    });
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Favorite');
  });

  it('resolves variant suffix from icon name', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="star-solid" />);
    });
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders null for unknown icon name', () => {
    const { container } = render(<DynamicPixelIcon name={'nonexistent' as never} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders fallback for unknown icon name', () => {
    render(<DynamicPixelIcon name={'nonexistent' as never} fallback={<span>Not found</span>} />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('reuses cached lazy component across renders', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" />);
    });
    await act(async () => {
      render(<DynamicPixelIcon name="heart" />);
    });
    expect(screen.getAllByTestId('mock-icon')).toHaveLength(2);
  });

  it('forwards className to the icon', async () => {
    await act(async () => {
      render(<DynamicPixelIcon name="heart" className="my-icon" />);
    });
    expect(screen.getByTestId('mock-icon')).toHaveClass('my-icon');
  });
});
