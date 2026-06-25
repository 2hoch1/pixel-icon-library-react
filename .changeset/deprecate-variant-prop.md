---
'@2hoch1/pixel-icon-library-react': patch
---

Re-introduce the `variant` prop on `PixelIcon` and `DynamicPixelIcon` as deprecated.

- `variant` is accepted again on both components and marked `@deprecated` for editor and TypeScript hints. It has no effect at runtime.
- Passing `variant` now logs a one-time, dev-only console warning that points to the name-based API (e.g. `name="heart-solid"`).
- Added a generic `warnOnce` helper that dedupes warnings and stays silent in production.
- Documented the deprecation in the README "Breaking Changes" section, including a `DynamicPixelIcon` migration example.
