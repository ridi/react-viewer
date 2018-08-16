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

### `Reader` Component

`Reader` component provides all functionality of viewer and renders viewer body.

Put `Reader` component into your component.
```js
import React from 'react';
import Reader from '@ridi/react-viewer';

export default ViewerPage extends React.Component {
    render() {
        return <Reader />;
    }
};
```

`Reader`'s properties:

* `onMount`(func): called after reader is mounted
* `onUnmount`(func): called after reader is unmounted
* `onTouched`(func): called when user touches the reader screen
* `footer`(node): markup for the footer area
* `contentFooter`(node): markup for the content footer area
* `ignoreScroll`(bool): temporarily disable scrolling (on `scroll` viewType)
* `disablePageCalculation`(bool): temporarily disable page calculation (on `page` viewType)

### Render Contents

#### `setContents`

Dispatch `setContents` action with content's metadata and URIs to render content into the reader.

```js
import { setContents, ContentFormat, BindingType } from '@ridi/react-viewer';

dispatch(setContents(ContentFormat.HTML, BindingType.LEFT, [
  './uri1.json',
  './uri2.json',
  ...
]));
```

* `contentFormat`: content format (HTML: 0, IMAGE: 1)
* `bindingType`: binding type (LEFT: 0, RIGHT: 1)

## How to Run Demo

```
$ npm install
$ npm run install:demo
$ npm run watch
```
Browse http://localhost:8000.
