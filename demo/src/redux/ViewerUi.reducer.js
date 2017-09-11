import { ViewerUiActions } from './ViewerUi.action';
import path from './Viewer.path';
import ReducerBuilder from '../../../src/util/ReducerBuilder';
import { updateObject } from '../../../src/util/Util';


const onToggleViewerSetting = state => new ReducerBuilder(state)
  .set(path.isVisibleSettingPopup(), !state.ui.isVisibleSettingPopup)
  .build();

const viewerSettingChanged = (state, action) => new ReducerBuilder(state)
  .set(path.viewerSettings(), updateObject(state.ui.viewerSettings, action.changeSetting))
  .build();

const ViewerUi = {
  [ViewerUiActions.TOGGLE_VIEWER_SETTING]: onToggleViewerSetting,
  [ViewerUiActions.VIEWER_SETTING_CHANGED]: viewerSettingChanged,
};

export default ViewerUi;
