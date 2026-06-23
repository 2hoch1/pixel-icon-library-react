import { describe, it, expect } from 'vitest';
import dynamicIconImports from '@/dynamicIconImports';

/**
 * Guards the dynamic-import path. Each loader must point at the library's own
 * generated icon module (`@/icons/<name>`), not at the upstream package, so
 * consumers need neither @hackernoon/pixel-icon-library nor an SVG loader at
 * runtime. Importing the map does not execute the loaders, so no SVG is
 * resolved here; real end-to-end resolution is verified against the built
 * `dist` output in CI (tests.yml "Verify dynamic imports resolve from dist").
 */
describe('dynamicIconImports', () => {
  it('exposes a non-empty map of icon loaders', () => {
    expect(Object.keys(dynamicIconImports).length).toBeGreaterThanOrEqual(500);
  });

  it('maps every icon name to a loader function', () => {
    for (const loader of Object.values(dynamicIconImports)) {
      expect(typeof loader).toBe('function');
    }
  });

  it('exposes a known icon (heart) as a callable loader', () => {
    expect(typeof dynamicIconImports['heart']).toBe('function');
  });
});
