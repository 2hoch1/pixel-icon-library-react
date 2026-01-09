import { Suspense, lazy, useMemo } from 'react';
import type { ReactNode, SVGProps } from 'react';
import dynamicIconImports from './dynamicIconImports';
import type { IconName, IconVariant } from './icon-types';

interface DynamicPixelIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName;
  variant?: IconVariant;
  size?: number | string;
  fallback?: ReactNode;
}

/**
 * DynamicPixelIcon - Lazy-loads icons at runtime for better code-splitting.
 * Falls back to `fallback` or null if the icon cannot be resolved.
 */
export const DynamicPixelIcon = ({
  name,
  variant,
  size = 24,
  fallback = null,
  ...props
}: DynamicPixelIconProps) => {
  const dimension = typeof size === 'number' ? `${size}px` : size ?? '24px';
  const resolvedName = useMemo<IconName | undefined>(() => {
    const hasBrandsSuffix = name.endsWith('-brands');
    const hasPurcatsSuffix = name.endsWith('-purcats');
    const hasSolidSuffix = name.endsWith('-solid');
    
    let baseName = name
      .replace(/-brands$/, '')
      .replace(/-purcats$/, '')
      .replace(/-solid$/, '');
    
    let targetVariant: IconVariant | undefined;
    
    if (variant) {
      targetVariant = variant;
    } else if (hasBrandsSuffix) {
      targetVariant = 'brands';
    } else if (hasPurcatsSuffix) {
      targetVariant = 'purcats';
    } else if (hasSolidSuffix) {
      targetVariant = 'solid';
    } else {
      targetVariant = 'regular';
    }
    
    const candidate = (targetVariant === 'regular' 
      ? baseName 
      : `${baseName}-${targetVariant}`) as IconName;
    
    return dynamicIconImports[candidate] ? candidate : undefined;
  }, [name, variant]);

  const LazyIcon = useMemo(() => {
    if (!resolvedName) return undefined;
    const importer = dynamicIconImports[resolvedName];
    return lazy(importer);
  }, [resolvedName]);

  if (!LazyIcon) return fallback ?? null;

  return (
    <Suspense fallback={fallback}>
      <LazyIcon {...props} width={dimension} height={dimension} />
    </Suspense>
  );
};

export default DynamicPixelIcon;
