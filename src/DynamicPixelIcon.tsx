import { Suspense, lazy, useEffect, useMemo } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import dynamicIconImports from '@/dynamicIconImports';
import type { IconName } from '@/icon-types';
import { resolveIconName } from '@/utils/resolveIconName';
import { warnOnce } from '@/utils/warnOnce';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
type LazyIconComponent = ReturnType<typeof lazy<IconComponent>>;

/**
 * Module-level cache prevents recreating lazy components on re-render,
 * avoiding unnecessary Suspense fallback flashes for already-loaded icons.
 * Bounded by the number of unique icon names rendered (~200 max).
 * For SSR environments, call {@link clearLazyCache} between requests.
 */
const lazyCache = new Map<IconName, LazyIconComponent>();

/** Clears the lazy icon component cache. Call this in SSR request handlers to avoid cross-request cache leakage. */
export function clearLazyCache(): void {
  lazyCache.clear();
}

interface DynamicPixelIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName;
  size?: number | string;
  title?: string;
  fallback?: ReactNode;
  /**
   * @deprecated Removed in v2.0.0 and ignored. Icons now resolve purely by name:
   * pass the full name instead, e.g. `name="heart-solid"` rather than
   * `name="heart" variant="solid"`.
   */
  variant?: 'regular' | 'solid';
}

const DEFAULT_SIZE = 24;

const VARIANT_DEPRECATION_MESSAGE =
  '[pixel-icon-library-react] The `variant` prop was removed in v2.0.0 and is ignored. ' +
  'Icons resolve by name only: use the full name (solid icons end in `-solid`), ' +
  'e.g. <DynamicPixelIcon name="heart-solid" /> instead of <DynamicPixelIcon name="heart" variant="solid" />.';

/**
 * Lazy-loads icon components on demand using `React.lazy` and `Suspense` for
 * optimal code-splitting. Each unique icon is fetched once and then cached.
 *
 * Prefer this over {@link PixelIcon} when your app uses Suspense boundaries
 * and you want automatic loading states without `useEffect`.
 *
 * @param props.name - Icon identifier (e.g. `"heart"`)
 * @param props.size - Uniform width/height as px number or CSS string. Defaults to 24.
 * @param props.title - Accessible label rendered as an SVG `<title>` element.
 * @param props.fallback - React node shown while the icon chunk is loading. Defaults to null.
 */
export const DynamicPixelIcon = ({
  name,
  size = DEFAULT_SIZE,
  title,
  fallback = null,
  variant,
  ...props
}: DynamicPixelIconProps) => {
  const dimension = typeof size === 'number' ? `${size}px` : (size ?? `${DEFAULT_SIZE}px`);

  const resolvedName = useMemo(() => resolveIconName(name), [name]);

  useEffect(() => {
    if (variant !== undefined) warnOnce(VARIANT_DEPRECATION_MESSAGE);
  }, [variant]);

  const LazyIcon = useMemo(() => {
    if (!resolvedName) return undefined;
    if (lazyCache.has(resolvedName)) return lazyCache.get(resolvedName)!;
    const component = lazy(dynamicIconImports[resolvedName]) as LazyIconComponent;
    lazyCache.set(resolvedName, component);
    return component;
  }, [resolvedName]);

  if (!LazyIcon) return fallback ?? null;

  return (
    <Suspense fallback={fallback}>
      <LazyIcon
        {...props}
        width={props.width ?? dimension}
        height={props.height ?? dimension}
        aria-label={props['aria-label'] ?? title ?? name}
        role={props.role ?? 'img'}
        focusable={props.focusable ?? 'false'}
        {...(title !== undefined ? { title } : {})}
      />
    </Suspense>
  );
};

export default DynamicPixelIcon;
