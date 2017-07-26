

## Installation
```
npm install ridi-webviewer
```

## Requirements
- react: >= 15.4.1
- react-dom >= 15.4.1
- react-redux >= 5.0.2
- redux >= 3.6.0
- redux-thunk >= 2.2.0
- reselect >= 3.0.0

## How to use

add `ridi-webviewer` reducer into your reducers.
```js
import { reducers as viewerScreen } from 'ridi-webviewer';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    ...
    viewerScreen,
    ...
});
```

connect `ViewerHelper`, `PageCalculator` with redux store.
```js
import { createStore } from 'redux';
import { ViewerHelper, PageCalculator } from 'ridi-webviewer';

const store = createStore( ... );
ViewerHelper.connect(store);
PageCalculator.connect(store);
```

put `ViewerScreen` component into your component.
```js
import React, { Component } from 'react';
import ViewerScreen from 'ridi-webviewer';

export default ViewerPage extends Component {
    render() {
        <ViewerScreen />
    }
};
```

dispatch `renderSpine` action.
```js
import { renderSpine } from 'ridi-webviewer';

...
const index = 0;
const html = '<h1>hello, world</h1>';
dispatch(renderSpine(index, html));
```
