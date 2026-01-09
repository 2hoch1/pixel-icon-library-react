import type {
  SVGProps,
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentType,
} from 'react';

/**
 * Minimal SVG element names supported by the icon set.
 * Mirrors the React 19 `SVGElementType` addition while staying backward compatible.
 */
export type IconSvgElement =
  | 'circle'
  | 'ellipse'
  | 'g'
  | 'line'
  | 'path'
  | 'polygon'
  | 'polyline'
  | 'rect';

export type IconNode = [elementName: IconSvgElement, attrs: Record<string, string>][];

export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
export type ElementAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;

export interface IconBaseProps extends ElementAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type IconComponent = ForwardRefExoticComponent<
  Omit<IconBaseProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

// Legacy/simple component typing used by the generated registry
export type IconProps = SVGProps<SVGSVGElement> & { title?: string };
export type IconComponentFn = ComponentType<IconProps>;
