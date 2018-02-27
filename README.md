# react-webviewer

[![Build Status](https://travis-ci.org/ridi/react-webviewer.svg?branch=master)](https://travis-ci.org/ridi/react-webviewer)
[![npm version](https://img.shields.io/npm/v/@ridi/react-webviewer.svg)](https://www.npmjs.com/package/@ridi/react-webviewer)
[![Greenkeeper badge](https://badges.greenkeeper.io/ridi/react-webviewer.svg)](https://greenkeeper.io/)

## Demo
http://www.ridicorp.com/react-webviewer/demo/

## Installation
```
npm install @ridi/react-webviewer
```

## How to Use

### Initialize

Add `@ridi/react-webviewer` reducer into your reducers.
```js
import { reducers as viewerScreen } from '@ridi/react-webviewer';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    ...
    viewerScreen,
    ...
});
```

Connect `ViewerHelper`, `PageCalculator`, `ReadPositionHelper` with redux store.
```js
import { createStore } from 'redux';
import { ViewerHelper, PageCalculator, ReadPositionHelper } from '@ridi/react-webviewer';

const store = createStore( ... );
ViewerHelper.connect(store, { ...options });
PageCalculator.connect(store, { ...options });
ReadPositionHelper.connect(store);
```

`ViewerHelper`'s options = defaults:
* `paddingVertical` = DEFAULT_PADDING_VERTICAL(`35`),
* `pageMaxWidth` = PAGE_MAX_WIDTH(`700`),
* `pageViewerSelector` = PAGE_VIEWER_SELECTOR(`#viewer_contents .pages`),
* `extendedTouchWidth` = EXTENDED_TOUCH_WIDTH(`100`),

`PageCalculator`'s options = defaults:
* `containExtraPage` = 1

### `ViewerScreen` Component

`ViewerScreen` component provides all functionality of viewer and renders viewer body.

Put `ViewerScreen` component into your component.
```js
import React from 'react';
import ViewerScreen from '@ridi/react-webviewer';

export default ViewerPage extends React.Component {
    render() {
        return <ViewerScreen />;
    }
};
```

`ViewerScreen`'s properties:

* `onMount`(func): called after viewer is mounted
* `onUnmount`(func): called after viewer is unmounted
* `onMoveWrongDirection`(func): called when user try to tap wrong direction to the next page (on `page` viewerType)
* `footer`(node): markup for the footer area
* `fontDomain`(string): prefixed URL for searching font files 
* `ignoreScroll`(bool): temporarily disable scrolling (on `scroll` viewerType)
* `disablePageCalculation`(bool): temporarily disable page calculation (on `page` viewerType)

You can extend or replace child components of `ViewerScreen` with the HoC-style function `createStyledViewerScreen()`.

```js
// Signature
createStyledViewerScreen = ({
  TouchableScrollScreen = ScrollScreen,
  StyledScrollContents = ScrollContents,
  TouchablePageScreen = PageScreen,
  StyledPageContents = PageContents,
  SizingWrapper = SizingWrapper,
} = {}) => ViewerScreen
```

This is an example.

```js
import {
    createStyledViewerScreen,
    SizingWrapper,
    ScrollContents,
    PageContents,
    ScrollScreen,
    PageScreen,
} from '@ridi/react-webviewer';

const TouchableScrollScreen = ScrollScreen.extend`...`;
const TouchablePageScreen = PageScreen.extend`...`;
...

createStyledViewerScreen({
    TouchablePageScreen,
    TouchableScrollScreen,
    ...,
})
```

### Render Contents

Dispatch `updateMetaData` action to update content's metadata.

```js
import {
  updateMetaData,
  ContentType,
  AvailableViewerType,
  BindingType,
} from '@ridi/react-webviewer';

const contentType = ContentType.COMIC;
const viewerType = AvailableViewerType.BOTH;
const bindingType = BindingType.LEFT;

dispatch(updateMetaData(contentType, viewerType, bindingType));
```

* `viewerType`: available viewer type (BOTH: 0, SCROLL: 1, PAGE: 2)
* `contentType`: content type (WEB_NOVEL: 10, COMIC: 20, WEBTOON: 30)
* `bindingType`: binding type (LEFT: 0, RIGHT: 1)

And then dispatch `renderSpine` action to render `html` into the viewer after loading contents data.
```js
import { renderSpine } from '@ridi/react-webviewer';

...
const index = 0;
const html = '<h1>hello, world</h1>';
dispatch(renderSpine(index, html));
```

If you have image contents to render lazily, dispatch `renderImages` instead of `renderSpine`.
```js
import { renderImages } from '@ridi/react-webviewer';

...
const images = [{ src: '/image_1.jpg' }, { src: '/image_2.jpg' }, ...];
dispatch(renderImages(images));
```
