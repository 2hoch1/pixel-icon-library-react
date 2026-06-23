import dynamicIconImports from '@/dynamicIconImports';
import type { IconName } from '@/icon-types';

/** Returns `name` if it is a registered icon key, otherwise `undefined`. */
export function resolveIconName(name: IconName): IconName | undefined {
  return dynamicIconImports[name] ? name : undefined;
}
