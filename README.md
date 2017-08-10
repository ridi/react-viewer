# react-webviewer
[![npm version](https://img.shields.io/npm/v/@ridi/react-webviewer.svg)](https://www.npmjs.com/package/@ridi/react-webviewer)

## Installation
```
npm install @ridi/react-webviewer
```

## How to use

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

Connect `ViewerHelper`, `PageCalculator` with redux store.
```js
import { createStore } from 'redux';
import { ViewerHelper, PageCalculator } from '@ridi/react-webviewer';

const store = createStore( ... );
ViewerHelper.connect(store);
PageCalculator.connect(store);
```

Put `ViewerScreen` component into your component.
```js
import React, { Component } from 'react';
import ViewerScreen from '@ridi/react-webviewer';

export default ViewerPage extends Component {
    render() {
        <ViewerScreen />
    }
};
```

Dispatch `renderSpine` action.
```js
import { renderSpine } from '@ridi/react-webviewer';

...
const index = 0;
const html = '<h1>hello, world</h1>';
dispatch(renderSpine(index, html));
```
