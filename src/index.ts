// Components
export { PixelIcon } from './PixelIcon';
export { DynamicPixelIcon } from './DynamicPixelIcon';

// Dynamic imports map
export { default as dynamicIconImports } from './dynamicIconImports';

// Icon types
export type {
  IconName,
  IconVariant,
  RegularIconName,
  SolidIconName,
} from './icon-types';

// Individual icon entrypoints
export * from './icons';

// Shared type definitions
export type {
  IconNode,
  IconBaseProps,
  IconComponent,
  IconProps,
  IconComponentFn,
  IconSvgElement,
  SVGAttributes,
  ElementAttributes,
} from './types/shared';
