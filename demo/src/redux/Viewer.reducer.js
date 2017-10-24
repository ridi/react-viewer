import { ViewerUiActions } from './Viewer.action';
import { actions as ViewerScreenActions } from '../../../lib/index';
import path, { initialState } from './Viewer.path';
import ReducerBuilder from '../../../src/util/ReducerBuilder';
import { updateObject } from '../../../src/util/Util';
import createReducer from '../../../src/util/Reducer';


const onToggleViewerSetting = state => new ReducerBuilder(state)
  .set(path.isVisibleSettingPopup(), !state.ui.isVisibleSettingPopup)
  .build();

const viewerSettingChanged = (state, action) => new ReducerBuilder(state)
  .set(path.viewerSettings(), updateObject(state.ui.viewerSettings, action.changeSetting))
  .build();

const onScreenTouched = state => new ReducerBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();

const onScreenScrolled = state => new ReducerBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();

const movePageViewer = state => new ReducerBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();


export default createReducer(initialState, {
  [ViewerUiActions.TOGGLE_VIEWER_SETTING]: onToggleViewerSetting,
  [ViewerUiActions.VIEWER_SETTING_CHANGED]: viewerSettingChanged,

  [ViewerScreenActions.TOUCH_VIEWER_SCREEN]: onScreenTouched,
  [ViewerScreenActions.SCROLLED_VIEWER_SCREEN]: onScreenScrolled,
  [ViewerScreenActions.MOVE_PAGE_VIEWER]: movePageViewer,
});
