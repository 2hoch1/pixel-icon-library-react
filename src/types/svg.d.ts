declare module '*.svg' {
  import * as React from 'react';
  const Component: React.ComponentType<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default Component;
}
