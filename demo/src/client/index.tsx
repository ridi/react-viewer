import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getRootElement } from './reader/util';

ReactDOM.render(<App /> as React.ReactElement, getRootElement());
