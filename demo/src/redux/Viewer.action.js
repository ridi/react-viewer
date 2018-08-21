import { setContentsByUri, setContentsByValue } from '../../../lib';
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
  hasLoadedContent,
}) => (dispatch) => {
  if (hasLoadedContent) {
    getJson(`./resources/contents/${id}/spine.json`)
      .then((contents) => {
        dispatch(setContentsByValue(contentFormat, bindingType, contents.map(content => content.content)));
      });
  } else {
    getJson(`./resources/contents/${id}/spine.json`)
      .then(({ contents: uris }) => {
        dispatch(setContentsByUri(contentFormat, bindingType, uris));
      });
  }
};

export const onScreenTouched = () => ({
  type: ViewerUiActions.TOUCHED,
});
