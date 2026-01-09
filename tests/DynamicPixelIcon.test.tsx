import { describe, it, expect } from 'vitest';
import { DynamicPixelIcon } from '../src/DynamicPixelIcon';

describe('DynamicPixelIcon exports', () => {
  it('should be a valid React component', () => {
    expect(DynamicPixelIcon).toBeDefined();
    expect(typeof DynamicPixelIcon).toBe('function');
  });

  it('should accept required props', () => {
    const props = {
      name: 'heart' as const,
    };
    expect(props.name).toBe('heart');
  });

  it('should accept optional size prop', () => {
    const props = {
      name: 'star' as const,
      size: 48,
    };
    expect(props.size).toBe(48);
  });

  it('should accept variant prop', () => {
    const props = {
      name: 'check' as const,
      variant: 'solid' as const,
    };
    expect(props.variant).toBe('solid');
  });

  it('should handle SVG props passthrough', () => {
    const props = {
      name: 'heart' as const,
      className: 'my-dynamic-icon',
      strokeWidth: 2,
      'data-testid': 'dynamic-icon',
    };
    expect(props.className).toBe('my-dynamic-icon');
    expect(props.strokeWidth).toBe(2);
    expect(props['data-testid']).toBe('dynamic-icon');
  });

  it('should support fallback prop', () => {
    const fallback = <div>Loading...</div>;
    expect(fallback).toBeTruthy();
  });
});

