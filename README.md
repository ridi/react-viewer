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
* `onScrolled`(func): called when scrolling event is triggered on screen (on `scroll` viewType)

### Render Contents

There are 2 ways to set contents in this reader.

#### Use `setContentMetadata` and `updateContent`
 
First of all, dispatch `setContentMetadata` for setting content metadata.
Then each content updated by one at a time.

```js
import {
  updateContent, 
  setContentMetadata,
  ContentFormat,
  BindingType,
} from '@ridi/react-viewer';

dispatch(setContentMetadata(ContentFormat.HTML, BindingType.LEFT, 50));

dispatch(updateContent(1, '<p>...</p>', false));
//... 1 ~ 50
dispatch(updateContent(50, '<p>...</p>', true));
```

#### `setContentsByValue` or `setContentsByUri`

Using this way, whole contents including metadata are set in a time.
Dispatch `setContents(ByValue/byUri)` action with already loaded content or content's URIs.

```js
import {
  setContentsByValue,
  setContentsByUri,
  ContentFormat,
  BindingType,
} from '@ridi/react-viewer';

dispatch(setContentsByUri(ContentFormat.HTML, BindingType.LEFT,[
  './uri1.json',
  './uri2.json',
  ...
]));

dispatch(setContentsByValue(ContentFormat.HTML, BindingType.LEFT,[
  '<p>...</p>',
  '<p>...</p>',
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
