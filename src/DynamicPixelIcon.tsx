import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import dynamicIconImports from './dynamicIconImports';
import type { IconName, IconVariant } from './icon-types';
import { resolveIconName } from './utils/resolveIconName';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
type LazyIconComponent = ReturnType<typeof lazy<IconComponent>>;

// Module-level cache prevents recreating lazy components on re-render,
// avoiding unnecessary Suspense fallback flashes for already-loaded icons.
const lazyCache = new Map<IconName, LazyIconComponent>();

interface DynamicPixelIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName;
  variant?: IconVariant;
  size?: number | string;
  title?: string;
  fallback?: ReactNode;
}

const DEFAULT_SIZE = 24;

/**
 * DynamicPixelIcon - Lazy-loads icons at runtime for better code-splitting.
 * Falls back to `fallback` or null if the icon cannot be resolved.
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
