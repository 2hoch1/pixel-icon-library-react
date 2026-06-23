// Public React components
export { PixelIcon } from '@/PixelIcon';
export { DynamicPixelIcon } from '@/DynamicPixelIcon';

// Lazy icon-loader registry (icon name -> dynamic import)
export { default as dynamicIconImports } from '@/dynamicIconImports';

// Icon name type
export type { IconName } from '@/icon-types';

// Per-icon component entrypoints
export * from '@/icons';

// Shared SVG and component type definitions
export type {
  IconNode,
  IconBaseProps,
  IconComponent,
  IconProps,
  IconComponentFn,
  IconSvgElement,
  SVGAttributes,
  ElementAttributes,
} from '@/types/shared';
