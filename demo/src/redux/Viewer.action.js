import { setContents } from '../../../lib';
import { getJson } from '../utils/Api';

export const ViewerUiActions = {
  TOGGLE_VIEWER_SETTING: 'VIEWER_FOOTER:TOGGLE_SETTING',
  VIEWER_SETTING_CHANGED: 'VIEWER:SETTING_CHANGED',
  TOUCHED: 'VIEWER:TOUCHED',
};

export const onToggleViewerSetting = () => ({
  type: ViewerUiActions.TOGGLE_VIEWER_SETTING,
});

export const viewerSettingChanged = changedSetting => ({
  type: ViewerUiActions.VIEWER_SETTING_CHANGED,
  changedSetting,
});

export const updateViewerSettings = changedSetting => (dispatch) => {
  dispatch(viewerSettingChanged(changedSetting));
};

export const requestLoadContent = ({
  id,
  contentFormat,
  bindingType,
}) => (dispatch) => {
  getJson(`./resources/contents/${id}/spine.json`)
    .then(({ contents }) => dispatch(setContents(contentFormat, bindingType, contents)));
};

export const onScreenTouched = () => ({
  type: ViewerUiActions.TOUCHED,
});
