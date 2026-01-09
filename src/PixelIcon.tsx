import type { ComponentType, SVGProps } from 'react';
import {
  iconRegistry,
  type IconName,
  type IconRegistry,
  type IconVariant,
  type RegularIconName,
  type SolidIconName,
} from './generated/icons';

export type { IconName, IconRegistry, IconVariant, RegularIconName, SolidIconName } from './generated/icons';

export type PixelIconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  variant?: IconVariant;
  size?: number | string;
  title?: string;
};

const defaultSize = 24;

export function PixelIcon({
  name,
  variant,
  size = defaultSize,
  title,
  ...rest
}: PixelIconProps) {
  const chosenVariant: IconVariant = variant ?? (name.endsWith('-solid') ? 'solid' : 'regular');
  const registry = iconRegistry[chosenVariant];
  const IconComponent = registry[name as keyof typeof registry] as
    | ComponentType<SVGProps<SVGSVGElement> & { title?: string }>
    | undefined;

  if (!IconComponent) {
    console.warn(`[pixel-icon-library-react] Unknown icon: ${name} (${chosenVariant}).`);
    return null;
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

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
