import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import dynamicIconImports from '@/dynamicIconImports';
import type { IconName } from '@/icon-types';
import { resolveIconName } from '@/utils/resolveIconName';
import { warnOnce } from '@/utils/warnOnce';

export type { IconName } from '@/icon-types';

export type PixelIconProps = SVGProps<SVGSVGElement> & {
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
};

const DEFAULT_SIZE = 24;

const VARIANT_DEPRECATION_MESSAGE =
  '[pixel-icon-library-react] The `variant` prop was removed in v2.0.0 and is ignored. ' +
  'Icons resolve by name only: use the full name (solid icons end in `-solid`), ' +
  'e.g. <PixelIcon name="heart-solid" /> instead of <PixelIcon name="heart" variant="solid" />.';

/**
 * Resolves and renders a pixel icon by dynamically importing its module at runtime.
 * Uses `useEffect` + `useState` for broad compatibility without requiring a Suspense boundary.
 *
 * Prefer {@link DynamicPixelIcon} when your app already uses Suspense and you want
 * automatic loading states. Use `PixelIcon` when Suspense is unavailable or undesirable.
 *
 * @param props.name - Icon identifier (e.g. `"heart"`, `"heart-solid"`)
 * @param props.size - Uniform width/height as px number or CSS string. Defaults to 24.
 * @param props.title - Accessible label rendered as an SVG `<title>` element.
 * @param props.fallback - React node shown while the icon is loading. Defaults to null.
 */
export function PixelIcon({
  name,
  size = DEFAULT_SIZE,
  title,
  fallback = null,
  variant,
  ...rest
}: PixelIconProps) {
  const [IconComponent, setIconComponent] =
    useState<ComponentType<SVGProps<SVGSVGElement> & { title?: string }>>();

  const resolvedName = useMemo(() => resolveIconName(name), [name]);

  useEffect(() => {
    if (variant !== undefined) warnOnce(VARIANT_DEPRECATION_MESSAGE);
  }, [variant]);

  useEffect(() => {
    let cancelled = false;
    if (!resolvedName) {
      setIconComponent(undefined);
      return undefined;
    }

    const importer = dynamicIconImports[resolvedName];
    importer()
      .then(mod => {
        if (!cancelled) {
          const Component = mod?.default as ComponentType<
            SVGProps<SVGSVGElement> & { title?: string }
          >;
          setIconComponent(() => Component);
        }
      })
      .catch(() => {
        if (!cancelled) setIconComponent(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedName]);

  if (!IconComponent) return fallback ?? null;

  const dimension = typeof size === 'number' ? `${size}px` : (size ?? `${DEFAULT_SIZE}px`);

  return (
    <IconComponent
      aria-label={title ?? name}
      role={rest.role ?? 'img'}
      focusable={rest.focusable ?? 'false'}
      width={rest.width ?? dimension}
      height={rest.height ?? dimension}
      {...(title !== undefined ? { title } : {})}
      {...rest}
    />
  );
}
