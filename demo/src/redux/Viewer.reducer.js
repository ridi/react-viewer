import createReducer from '../../../src/util/Reducer';
import { initialState } from './Viewer.path';
import ViewerUi from './ViewerUi.reducer';


export default createReducer(initialState, Object.assign({}, ...[
  ViewerUi,
]));
