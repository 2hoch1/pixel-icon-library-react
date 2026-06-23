---
'@2hoch1/pixel-icon-library-react': major
---

Remove the `variant` concept. Icons now resolve purely by name.

The `variant` prop on `PixelIcon` and `DynamicPixelIcon` is gone, along with the
`IconVariant`, `RegularIconName`, and `SolidIconName` type exports. Pass the full
icon name instead: solid icons end in `-solid` (`heart-solid`), brand and category
icons use their plain name (`github`, `business`).

Migration:

```diff
- <PixelIcon name="heart" variant="solid" />
+ <PixelIcon name="heart-solid" />
```
