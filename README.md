# `@2hoch1/pixel-icon-library-react`

React wrapper for the HackerNoon [Pixel Icon Library][pixel-icon-library-repo]. Browse all icons on the [website][pixel-icon-library].

## Installation

```bash
npm install @2hoch1/pixel-icon-library-react react
```

`react` (`>=18 <20`) is a peer dependency.

## Usage

<!--prettier-ignore-start-->

Three ways to render an icon: tree-shakeable **named imports**, or the **`PixelIcon`** and **`DynamicPixelIcon`** components that resolve a name at runtime.

### Named imports

Each export is the PascalCase form of the icon name (e.g. `HeartSolid`), with no `Icon` suffix. They forward every SVG prop and default `fill`/`stroke` to `currentColor`.

```tsx
import { Heart, HeartSolid, Github } from "@2hoch1/pixel-icon-library-react";

// Size with the `size` prop or raw width/height.
function Toolbar() {
  return (
    <>
      <Heart size={24} />
      <Github width={48} height={48} />
    </>
  );
}

// Tailwind: size-* sets dimensions, text-* sets color via currentColor.
function Styled() {
  return <HeartSolid className="size-8 text-red-500" />;
}
```

A single icon is also reachable by subpath:

```tsx
import Heart from "@2hoch1/pixel-icon-library-react/icons/heart";
```

### `PixelIcon`

Renders an icon by name, no Suspense required. Names are kebab-case; solid icons end in `-solid` (`heart-solid`), others use their plain name (`github`, `business`).

```tsx
import { PixelIcon } from "@2hoch1/pixel-icon-library-react";

// Render by name; size with `size` or raw width/height.
function Toolbar() {
  return (
    <>
      <PixelIcon name="heart" size={24} />
      <PixelIcon name="exclamation-triangle-solid" size={24} />
    </>
  );
}
```

Unknown or failed names render the `fallback`, which is also shown while loading:

```tsx
import { PixelIcon } from "@2hoch1/pixel-icon-library-react";

function WithFallback() {
  return <PixelIcon name="heart" fallback={<span>...</span>} />;
}
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `IconName` | required | Icon name, kebab-case. |
| `size` | `number \| string` | `24` | Width and height. |
| `title` | `string` | `undefined` | Sets `aria-label`; falls back to `name`. |
| `fallback` | `ReactNode` | `null` | Shown while loading and for unknown icons. |

Any standard SVG prop is forwarded as well.

### `DynamicPixelIcon`

Same props as `PixelIcon`, backed by `React.lazy` and `Suspense`. Use it inside a Suspense boundary.

```tsx
import { DynamicPixelIcon } from "@2hoch1/pixel-icon-library-react";

<DynamicPixelIcon name="star-solid" size={24} fallback={<span>...</span>} />;
```

On the server, call `clearLazyCache()` between requests:

```tsx
import { clearLazyCache } from "@2hoch1/pixel-icon-library-react";

clearLazyCache();
```

### Lazy loading (manually)

`dynamicIconImports` maps each name to a per-icon importer:

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
```

<!--prettier-ignore-end-->

## Breaking Changes

### [2.0.0]

Removed the `variant` concept; icons now resolve purely by name, along with the `IconVariant`, `RegularIconName`, and `SolidIconName` type exports. The `variant` prop on `PixelIcon` and `DynamicPixelIcon` is deprecated. Pass the full icon name instead: solid icons end in `-solid` (`heart-solid`), brand and category icons use their plain name (`github`, `business`).

```diff
- <PixelIcon name="heart" variant="solid" />
+ <PixelIcon name="heart-solid" />

- <DynamicPixelIcon name="heart" variant="solid" />
+ <DynamicPixelIcon name="heart-solid" />
```

## Credits

Icons come from the [Pixel Icon Library][pixel-icon-library-repo]; see that repo for the icon license.

## License

This project is licensed under the [MIT License][license].

[pixel-icon-library]: https://pixeliconlibrary.com/
[pixel-icon-library-repo]: https://github.com/hackernoon/pixel-icon-library
[license]: LICENSE
