# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [unreleased]

## [v1.0.0-alpha.6]

### Fixed

- Adaptively using `useCapture` or `options` parameter for `addEventListener`, `removeEventListener` according to browser supports
- Manage properly `Reader.js` lifecycle

### Changed

- `onTouched(event)` property will be called with `event` parameter.
- `CommonUi` -> `BrowserWrapper`

### Removed

- `onMoveWrongDirection` property was removed.
- No more handling current offset triggered by click, touch and keyboard events.
- `CommonUi`

## [v1.0.0-alpha.5]

### Fixed

- Resolve some performance issues

## [v1.0.0-alpha.4]

### Changed

- All settings using level will use actual numeric value.
  - `fontSizeLevel` => `fontSizeInPx`
  - `paddingLevel` => `contentPaddingInPercent`
  - `contentWidthLevel` => `contentWidthInPercent`
  - `lineHeightLevel` => `lineHeightInEm`
  - `columnGap` => `columnGapInPercent` 
  
### Fixed

- At scroll view, calculations total(=total height) was adjusted.

## [v1.0.0-alpha.3]

### Changed
- Change default Webpack's `mode` value to `production`
- `setting.updateSetting()` calls `calculations.invalidate()`
- HTML page view was applied `paddingLevel` setting
- Move all calculations related with layout to `SettingConnector`

### Fixed
- Fix using setting `maxWidth` value from `setting.maxWidth` instead of `props.maxWidth`
- Fix wrong page calculation

## [v1.0.0-alpha.2]
**!! Breaking Changes !!**

### Added

- New features
  - Double page view
  - Set blank as a first page
  - Handling with keyboard event for changing offset 
- Introduce new settings
  - `columnsInPage`
  - `columnGap`
  - `startWithBlankPage`
  - `maxWidth`
  - `contentFooterHeight`
  - `containerHorizontalMargin`
  - `containerVerticalMargin`
  - `extendedSideTouchWidth`

### Changed

- Refactoring almost overall for rendering multiple spines stably
- Rename: `<ViewerScreen>` -> `<Reader>`
- Rename: classes extended `Connector` -> `...Connector`

### Removed

- Removed settings:
  - `isFullScreen`
  - `availableViewType`

## [v0.3.9-alpha.1]

- Update dependencies (includes settings for Greenkeeper)
    - `styled-components` 2.x.x => 3.x.x
    - `webpack-manifest-plugin`(dev): 1.x.x => 2.x.x
    - And some minor version updates...
- Add peer dependencies: `react`, `redux`, `react-dom`, `react-redux`
- Reduce library bundle size by excluding peer dependencies from bundled file

[unreleased]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.6...HEAD
[v1.0.0-alpha.6]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.5...1.0.0-alpha.6
[v1.0.0-alpha.5]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.4...1.0.0-alpha.5
[v1.0.0-alpha.4]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.3...1.0.0-alpha.4
[v1.0.0-alpha.3]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.2...1.0.0-alpha.3
[v1.0.0-alpha.2]: https://github.com/ridi/react-viewer/compare/0.3.9-alpha.1...1.0.0-alpha.2
[v0.3.9-alpha.1]: https://github.com/ridi/react-viewer/compare/0.3.8...0.3.9-alpha.1
