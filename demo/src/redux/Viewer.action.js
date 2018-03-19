import { renderSpine, renderImages } from '../../../lib/index';
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

export const requestLoadEpisodeEpub = (spine, index) => (dispatch) => {
  getJson(spine).then(({ value }) => dispatch(renderSpine(index, value)));
};

export const requestLoadEpisode = (contentId, episodeId) => (dispatch) => {
  const spineUrl = `./resources/contents/${contentId}/${episodeId}/spine.json`;
  getJson(spineUrl).then(({ spines, images }) => {
    if (spines) {
      spines.forEach((spine, index) => dispatch(requestLoadEpisodeEpub(spine, index)));
    } else if (images) {
      dispatch(renderImages(images));
    }
  });
};
