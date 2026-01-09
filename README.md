# @2hoch1/pixel-icon-library-react

React components for the [Pixel Icon Library][pixel-icon-library] - a set of pixelated icons that can be easily imported and used as React components.

Icons are pulled directly from `@hackernoon/pixel-icon-library` at build time. This ensures that every release always includes the latest upstream SVGs without requiring manual pre-generation of components.

## Installation

```bash
npm install @2hoch1/pixel-icon-library-react react
# or
yarn add @2hoch1/pixel-icon-library-react react
# or
pnpm add @2hoch1/pixel-icon-library-react react
```

## Usage

<!--prettier-ignore-start-->

```tsx
import {
  AdIcon, AlertTriangleSolidIcon, HeartIcon,
} from "@2hoch1/pixel-icon-library-react";

export function MyComponent() {
  return (
    <div>
      <HeartIcon size={24} />
      <AlertTriangleSolidIcon size={32} color="red" />
      <AdIcon width={48} height={48} />
    </div>
  );
}
```

### Dynamic Icon Component

`PixelIcon` resolves icons dynamically at runtime from the upstream package. Unknown names or failed imports are safely ignored and render `null`.

```tsx
import { PixelIcon } from "@2hoch1/pixel-icon-library-react";

export function DynamicExample() {
  return (
    <div>
      {/* Regular variant (default) */}
      <PixelIcon name="heart" size={24} />

      {/* Solid variant - automatically detected from name */}
      <PixelIcon name="alert-triangle-solid" size={24} />

      {/* Or specify variant explicitly */}
      <PixelIcon name="alert-triangle" variant="solid" size={24} />
    </div>
  );
}
```

### Code Splitting with Dynamic Imports

If you want to lazy load icons yourself, `dynamicIconImports` exposes per-icon importers:

```tsx
import { Suspense, lazy, useMemo } from "react";
import dynamicIconImports from "@2hoch1/pixel-icon-library-react/dynamicIconImports";

function Icon({ name, ...props }) {
  const LazyIcon = useMemo(() => lazy(dynamicIconImports[name]), [name]);

  return (
    <Suspense fallback={<div style={{ width: 24, height: 24 }} />}>
      <LazyIcon {...props} />
    </Suspense>
  );
}

export function LazyLoadedIcon() {
  return <Icon name="heart" size={24} />;
}
```

<!--prettier-ignore-end-->

You can browse all available icons on the [Pixel Icon Library][pixel-icon-library] website.

## Credits

- **Icons**: Created by [HackerNoon][hackernoon] - see the original [Pixel Icon Library][pixel-icon-library]
- **React wrapper**: Created by [2hoch1][react-wrapper-repo] - inspired by lucide-react's excellent architecture.

## License

This project is licensed under the [MIT License][license].
For the icon license, please refer to the original [Pixel Icon Library][pixel-icon-library-repo] repository.

[pixel-icon-library]: https://pixeliconlibrary.com/
[hackernoon]: https://hackernoon.com/
[pixel-icon-library-repo]: https://github.com/hackernoon/pixel-icon-library
[react-wrapper-repo]: https://github.com/2hoch1/pixel-icon-library-react
[license]: LICENSE
