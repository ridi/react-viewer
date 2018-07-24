import { setContents, ContentFormat } from '../../../lib/index';
import { getJson } from '../utils/Api';

export const ViewerUiActions = {
  TOGGLE_VIEWER_SETTING: 'VIEWER_FOOTER:TOGGLE_SETTING',
  VIEWER_SETTING_CHANGED: 'VIEWER:SETTING_CHANGED',
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

export const requestLoadContent = contentId => (dispatch) => {
  const spineUrl = `./resources/contents/${contentId}/spine.json`;
  getJson(spineUrl).then(({ spines, images }) => {
    if (spines) {
      dispatch(setContents(ContentFormat.HTML, spines));
    } else if (images) {
      dispatch(setContents(ContentFormat.IMAGE, images));
    }
  });
};
