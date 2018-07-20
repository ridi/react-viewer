# @ridi/react-viewer

[![Build Status](https://travis-ci.org/ridi/react-viewer.svg?branch=master)](https://travis-ci.org/ridi/react-viewer)
[![npm version](https://img.shields.io/npm/v/@ridi/react-viewer.svg)](https://www.npmjs.com/package/@ridi/react-viewer)
[![Greenkeeper badge](https://badges.greenkeeper.io/ridi/react-viewer.svg)](https://greenkeeper.io/)

## Demo
https://ridi.github.io/react-viewer/demo/

## Installation
```
npm install @ridi/react-viewer
```

## How to Use

### Initialize

Add `@ridi/react-viewer` reducer into your reducers.
```js
import { reducers as reader } from '@ridi/react-viewer';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    ...
    reader,
    ...
});
```

Connect `Connector` with redux store.
```js
import { createStore } from 'redux';
import { Connector } from '@ridi/react-viewer';

const store = createStore( ... );
Connector.connect(store);
```

### `Viewer` Component

`Viewer` component provides all functionality of viewer and renders viewer body.

Put `Viewer` component into your component.
```js
import React from 'react';
import Viewer from '@ridi/react-viewer';

export default ViewerPage extends React.Component {
    render() {
        return <Viewer />;
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

### Render Contents

1. Update meta data with `updateMetadata`
2. Render contents with `renderSpine` or `renderImages`

#### `updateMetadata`

Dispatch `updateMetadata` action to update content's metadata.

```js
import {
  updateMetadata,
  ContentType,
  AvailableViewerType,
  BindingType,
} from '@ridi/react-viewer';

const contentType = ContentType.COMIC;
const viewerType = AvailableViewerType.BOTH;
const bindingType = BindingType.LEFT;

dispatch(updateMetadata(contentType, viewerType, bindingType));
```

* `viewerType`: available viewer type (BOTH: 0, SCROLL: 1, PAGE: 2)
* `contentType`: content type (WEB_NOVEL: 10, COMIC: 20, WEBTOON: 30)
* `bindingType`: binding type (LEFT: 0, RIGHT: 1)

#### `setContents`

And then dispatch `setContents` action with URIs to render content into the viewer.
```js
import { setContents } from '@ridi/react-viewer';

...
dispatch(setContents([
  './uri1.json',
  './uri2.json',
  ...
]));
```

## How to Run Demo

```
$ npm install
$ npm run install:demo
$ npm run watch
```
Browse http://localhost:8000.
