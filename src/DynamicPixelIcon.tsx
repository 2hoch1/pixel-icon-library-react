import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import dynamicIconImports from './dynamicIconImports';
import type { IconName, IconVariant } from './icon-types';
import { resolveIconName } from './utils/resolveIconName';

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
  variant?: IconVariant;
  size?: number | string;
  title?: string;
  fallback?: ReactNode;
}

const DEFAULT_SIZE = 24;

/**
 * Lazy-loads icon components on demand using `React.lazy` and `Suspense` for
 * optimal code-splitting. Each unique icon is fetched once and then cached.
 *
 * Prefer this over {@link PixelIcon} when your app uses Suspense boundaries
 * and you want automatic loading states without `useEffect`.
 *
 * @param props.name - Icon identifier (e.g. `"heart"`, `"alert-triangle-solid"`)
 * @param props.variant - Optional variant override (`"solid"` | `"regular"` | `"brands"` | `"purcats"`)
 * @param props.size - Uniform width/height as px number or CSS string. Defaults to 24.
 * @param props.title - Accessible label rendered as an SVG `<title>` element.
 * @param props.fallback - React node shown while the icon chunk is loading. Defaults to null.
 */
export const DynamicPixelIcon = ({
  name,
  variant,
  size = DEFAULT_SIZE,
  title,
  fallback = null,
  ...props
}: DynamicPixelIconProps) => {
  const dimension = typeof size === 'number' ? `${size}px` : (size ?? `${DEFAULT_SIZE}px`);

  const resolvedName = useMemo(() => resolveIconName(name, variant), [name, variant]);

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
        title={title}
      />
    </Suspense>
  );
};

export default DynamicPixelIcon;
