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
* `footer`(node): markup for the footer area
* `contentFooter`(node): markup for the content footer area
* `selectable`(boolean): set reader to be selectable
* `annotationable`(boolean): set reader to be annotationable
* `annotations`(array): annotation list is composed of items that has distinct `id` property. 

### Events

* `Events.SCROLL`: Screen is scrolled
* `Events.TOUCH`: Screen is touched
* `Events.TOUCH_ANNOTATION`: An annotation item is touched
* `Events.CHANGE_SELECTION`: Current selection is changed
* `Events.MOUNTED`: `<Reader>` has been mounted
* `Events.UNMOUNTED`: `<Reader>` has been unmounted

### Render Contents

#### `setContentsByValue` or `setContentsByUri`

Whole contents including metadata are set in a time.
Dispatch `setContents(ByValue/byUri)` action with already loaded content or content's URIs.

```js
import {
  setContentsByValue,
  setContentsByUri,
  ContentFormat,
  BindingType,
  EventBus,
  Events,
} from '@ridi/react-viewer';

EventBus.emit(Events.SET_CONTENTS_BY_URI, {
  contentFormat: ContentFormat.HTML,
  bindingType: BindingType.LEFT,
  uris: [
    './uri1.json',
    './uri2.json',
    ...,
  ],
});

EventBus.emit(Events.SET_CONTENTS_BY_VALUE, {
  contentFormat: ContentFormat.HTML,
  bindingType: BindingType.LEFT,
  contents: [
    '<p>...</p>',
    '<p>...</p>',
    ...,
  ],
});
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
