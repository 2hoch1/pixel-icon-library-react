import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import dynamicIconImports from './dynamicIconImports';
import type { IconName, IconVariant } from './icon-types';
import { resolveIconName } from './utils/resolveIconName';

export type { IconName, IconVariant } from './icon-types';

export type PixelIconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  variant?: IconVariant;
  size?: number | string;
  title?: string;
  fallback?: ReactNode;
};

const DEFAULT_SIZE = 24;

export function PixelIcon({
  name,
  variant,
  size = DEFAULT_SIZE,
  title,
  fallback = null,
  ...rest
}: PixelIconProps) {
  const [IconComponent, setIconComponent] =
    useState<ComponentType<SVGProps<SVGSVGElement> & { title?: string }>>();

  const resolvedName = useMemo(() => resolveIconName(name, variant), [name, variant]);

  useEffect(() => {
    let cancelled = false;
    if (!resolvedName) {
      setIconComponent(undefined);
      return undefined;
    }

    const importer = dynamicIconImports[resolvedName];
    importer()
      .then((mod) => {
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
      title={title}
      {...rest}
    />
  );
}
