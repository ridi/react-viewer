# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.0-alpha.29]

### Added

- Add `SCROLL_DEBOUNCED` event

## [v1.0.0-alpha.28]

### Added

- Add a hook `afterContentCalculated`

## [v1.0.0-alpha.27]

### Added

- Add `getOffsetFromSerializedRange` and `getOffsetFromAnchor` methods to `ReaderJsHelper`
- Add a hook `beforeContentCalculated` for calculation service

### Fixed

- Fix SelectionLayer(svg) layer style
- Prevent uncaught errors from Promise

## [v1.0.0-alpha.26]

### Changed

- Remove `Events.TOUCH_ANNOTATION` and treat as a sort of `Events.TOUCH`

## [v1.0.0-alpha.25]

### Fixed
- Fix issue window resizing cannot trigger recalculation on image + scroll view mode

## [v1.0.0-alpha.24]

### Fixed
- Invalidate all calculations after `SET_ANNOTATIONS` event is occurred

## [v1.0.0-alpha.23]

### Added
- Revise images in HTML content via `@ridi/reader.js`
- Content caching revised `<img>` tag (contains `width` and `height` property)

## [v1.0.0-alpha.22]

### Added
- Added more events related with annotation

### Fixed
- Give more accurate meaning to `calculations.contents[].isCalculated` in Redux
- Fix `SettingConnector.getContainerWidthInternal()` calculation 

### Changed
- Selection(Annotation) property renaming: `style` -> `color`
- Make RxJS-based `SelectionStore` replacing with Redux-based `SelectionConnector`

## [v1.0.0-alpha.21]

### Fixed
- Fix `Range.expand()` error in the Electron environment
- Fix Some circular dependency issues

## [v1.0.0-alpha.20]

### Changed
- Add `constants` entry to build option

## [v1.0.0-alpha.18]

### Fixed 
- Fix recalculation bug on image viewer

## [v1.0.0-alpha.17]

### Fixed

- Fix calculation issue when `viewType === PAGE` and `contentFormat === IMAGE`

## [v1.0.0-alpha.16]

### Added

-  Add additional information `viewPortRange` to `current` redux store

### Fixed

- Load reader.js using user touching position instead of `current` in redux store

## [v1.0.0-alpha.15]

### Changed

- Upgrade and modify `.release-it.json` script

## [v1.0.0-alpha.14]

### Fixed

- Fix selection issue when two contents in the screen on `viewType === Scroll`

## [v1.0.0-alpha.13]

### Added
- Selection / Annotation management [PR#88](https://github.com/ridi/react-viewer/pull/88)

### Breaking Changes
- Lifecycle management with RxJs [PR#90](https://github.com/ridi/react-viewer/pull/90)

## [v1.0.0-alpha.12]

## [v1.0.0-alpha.11]

### Fixed
- Remove duplicated action for calculation offset update [PR#83](https://github.com/ridi/react-viewer/pull/83)

## [v1.0.0-alpha.10]

### Added

- Provide new actions (`load` and `unload`) to be available saving/restore current states
- Add new Redux states (`status.isLoaded`, `calculations.contents[].offset`, `calculations.footer.offset`)

### Changed

- Add default gap between contents on scroll mode

### Fixed
  
- Make sure `moveToOffset()` be called whenever current content is changed on page mode
- Fix calculation error on getting height from scrolled contents

## [v1.0.0-alpha.9]

### Changed
- `<Reader>` allows its children
- Babel upgraded v7.0

### Removed
- Remove internal loading/error indicators

## [v1.0.0-alpha.8]

### Changed
- Published as multiple modules

## [v1.0.0-alpha.7]

### Added

- `status.isReadyToRead` in Redux store to improvement on user-side performance
    - Though page calculation is not completed, `status.isReadyToRead` can be true when current content(`current.contentIndex`) is ready to read.

### Changed

- Separate action of loading contents
    - `setContents` action -> `setContentsByUri`, `setContentsByValue` actions 
- `READER:SCROLLED` action -> `onScrolled` property of `<Reader>`


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

[Unreleased]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.29...HEAD
[v1.0.0-alpha.29]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.28...1.0.0-alpha.29
[v1.0.0-alpha.28]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.27...1.0.0-alpha.28
[v1.0.0-alpha.27]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.26...1.0.0-alpha.27
[v1.0.0-alpha.26]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.25...1.0.0-alpha.26
[v1.0.0-alpha.25]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.24...1.0.0-alpha.25
[v1.0.0-alpha.24]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.23...1.0.0-alpha.24
[v1.0.0-alpha.23]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.22...1.0.0-alpha.23
[v1.0.0-alpha.22]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.21...1.0.0-alpha.22
[v1.0.0-alpha.21]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.20...1.0.0-alpha.21
[v1.0.0-alpha.20]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.18...1.0.0-alpha.20
[v1.0.0-alpha.18]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.17...1.0.0-alpha.18
[v1.0.0-alpha.17]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.16...1.0.0-alpha.17
[v1.0.0-alpha.16]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.15...1.0.0-alpha.16
[v1.0.0-alpha.15]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.14...1.0.0-alpha.15
[v1.0.0-alpha.14]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.13...1.0.0-alpha.14
[v1.0.0-alpha.13]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.12...1.0.0-alpha.13
[v1.0.0-alpha.12]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.11...1.0.0-alpha.12
[v1.0.0-alpha.11]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.10...1.0.0-alpha.11
[v1.0.0-alpha.10]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.9...1.0.0-alpha.10
[v1.0.0-alpha.9]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.8...1.0.0-alpha.9
[v1.0.0-alpha.8]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.7...1.0.0-alpha.8
[v1.0.0-alpha.7]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.6...1.0.0-alpha.7
[v1.0.0-alpha.6]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.5...1.0.0-alpha.6
[v1.0.0-alpha.5]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.4...1.0.0-alpha.5
[v1.0.0-alpha.4]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.3...1.0.0-alpha.4
[v1.0.0-alpha.3]: https://github.com/ridi/react-viewer/compare/1.0.0-alpha.2...1.0.0-alpha.3
[v1.0.0-alpha.2]: https://github.com/ridi/react-viewer/compare/0.3.9-alpha.1...1.0.0-alpha.2
[v0.3.9-alpha.1]: https://github.com/ridi/react-viewer/compare/0.3.8...0.3.9-alpha.1
