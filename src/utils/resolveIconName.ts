import dynamicIconImports from '../dynamicIconImports';
import type { IconName, IconVariant } from '../icon-types';

/**
 * Resolves an icon name + optional variant to the actual key used in dynamicIconImports.
 * Also infers the variant from name suffixes (-brands, -purcats, -solid) when not explicit.
 * Returns undefined if no matching icon is registered.
 */
export function resolveIconName(name: IconName, variant?: IconVariant): IconName | undefined {
  const hasBrandsSuffix = name.endsWith('-brands');
  const hasPurcatsSuffix = name.endsWith('-purcats');
  const hasSolidSuffix = name.endsWith('-solid');

  const baseName = name
    .replace(/-brands$/, '')
    .replace(/-purcats$/, '')
    .replace(/-solid$/, '');

  let targetVariant: IconVariant;

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

  const candidate = (
    targetVariant === 'regular' ? baseName : `${baseName}-${targetVariant}`
  ) as IconName;

  return dynamicIconImports[candidate] ? candidate : undefined;
}
