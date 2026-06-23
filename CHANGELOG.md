## [1.1.3](https://github.com/2hoch1/pixel-icon-library-react/compare/v1.1.2...v1.1.3) (2026-03-22)

## 2.0.0

### Major Changes

- 9991cab: Remove the `variant` concept. Icons now resolve purely by name.

  The `variant` prop on `PixelIcon` and `DynamicPixelIcon` is gone, along with the
  `IconVariant`, `RegularIconName`, and `SolidIconName` type exports. Pass the full
  icon name instead: solid icons end in `-solid` (`heart-solid`), brand and category
  icons use their plain name (`github`, `business`).

  Migration:

  ```diff
  - <PixelIcon name="heart" variant="solid" />
  + <PixelIcon name="heart-solid" />
  ```

### Bug Fixes

- ci ([1818cff](https://github.com/2hoch1/pixel-icon-library-react/commit/1818cffa45f942573f923cba2346e444eddb64db))
- **DynamicPixelIcon:** memory leak ([7cf070c](https://github.com/2hoch1/pixel-icon-library-react/commit/7cf070c2c394bce1f8f2af7ec17531573f3ccc30))
- upgrade npm for OIDC trusted publishing and reduce triple build ([4a79392](https://github.com/2hoch1/pixel-icon-library-react/commit/4a7939266b9fb98895f98ec49b546293fd947de0))

## [1.1.2](https://github.com/2hoch1/pixel-icon-library-react/compare/v1.1.1...v1.1.2) (2026-03-20)

### Bug Fixes

- size param missing ([e906f65](https://github.com/2hoch1/pixel-icon-library-react/commit/e906f65f414fcf2669df3634076aa45f3f1a53d5))
