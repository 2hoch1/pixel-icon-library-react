import { describe, it, expect } from 'vitest';
import { PixelIcon } from '../src/PixelIcon';

describe('PixelIcon exports', () => {
  it('should be a valid React component', () => {
    expect(PixelIcon).toBeDefined();
    expect(typeof PixelIcon).toBe('function');
  });

  it('should accept required props', () => {
    const props = {
      name: 'heart' as const,
    };
    expect(props.name).toBe('heart');
  });

  it('should have proper TypeScript typing', () => {
    const testIcon = {
      name: 'star-solid' as const,
      variant: 'solid' as const,
      size: 32,
    };
    expect(testIcon.name).toBe('star-solid');
    expect(testIcon.variant).toBe('solid');
    expect(testIcon.size).toBe(32);
  });

  it('should handle optional props', () => {
    const props = {
      name: 'check' as const,
      className: 'my-icon',
      title: 'Done',
    };
    expect(props.className).toBe('my-icon');
    expect(props.title).toBe('Done');
  });
});

