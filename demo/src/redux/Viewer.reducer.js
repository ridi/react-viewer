import { ViewerUiActions } from './Viewer.action';
import { actions as ViewerActions } from '../../../lib';
import path, { initialState } from './Viewer.path';
import { ImmutableObjectBuilder } from '../../../src/util/ImmutabilityHelper';
import { updateObject } from '../../../src/util/Util';
import createReducer from '../../../src/util/Reducer';


const onToggleViewerSetting = state => new ImmutableObjectBuilder(state)
  .set(path.isVisibleSettingPopup(), !state.ui.isVisibleSettingPopup)
  .build();

const viewerSettingChanged = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.viewerSettings(), updateObject(state.ui.viewerSettings, action.changeSetting))
  .build();

const onScreenTouched = state => new ImmutableObjectBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();

const onScreenScrolled = state => new ImmutableObjectBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();

const movePageViewer = state => new ImmutableObjectBuilder(state)
  .set(path.isVisibleSettingPopup(), false)
  .build();


export default createReducer(initialState, {
  [ViewerUiActions.TOGGLE_VIEWER_SETTING]: onToggleViewerSetting,
  [ViewerUiActions.VIEWER_SETTING_CHANGED]: viewerSettingChanged,

  [ViewerActions.TOUCHED]: onScreenTouched,
  [ViewerActions.SCROLLED]: onScreenScrolled,
  [ViewerActions.UPDATE_CURRENT]: movePageViewer,
});
