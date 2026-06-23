// Ambient module declarations for upstream .svg imports from @hackernoon/pixel-icon-library.
// tsc cannot resolve these specifiers; esbuild-plugin-svgr substitutes the React component at build time.
declare module '@hackernoon/pixel-icon-library/icons/SVG/brands/*.svg' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
  const Component: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  export default Component;
}

declare module '@hackernoon/pixel-icon-library/icons/SVG/purcats/*.svg' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
  const Component: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  export default Component;
}

declare module '@hackernoon/pixel-icon-library/icons/SVG/regular/*.svg' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
  const Component: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  export default Component;
}

declare module '@hackernoon/pixel-icon-library/icons/SVG/solid/*.svg' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
  const Component: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  export default Component;
}
