import { setContentsByUri, setContentsByValue } from '@ridi/react-viewer';
import { getJson } from '../utils/Api';

export const ViewerUiActions = {
  TOGGLE_VIEWER_SETTING: 'VIEWER_FOOTER:TOGGLE_SETTING',
  VIEWER_SETTING_CHANGED: 'VIEWER:SETTING_CHANGED',
  TOUCHED: 'VIEWER:TOUCHED',
  SCROLLED: 'VIEWER:SCROLLED',
  ADD_ANNOTATION: 'VIEWER:ADD_ANNOTATION',
  UPDATE_ANNOTATION: 'VIEWER:SET_ANNOTATION',
  SET_ANNOTATIONS: 'VIEWER:SET_ANNOTATIONS',
  REMOVE_ANNOTATION: 'VIEWER:REMOVE_ANNOTATION',
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

export const onScreenScrolled = () => ({
  type: ViewerUiActions.SCROLLED,
});

export const addAnnotation = annotation => ({
  type: ViewerUiActions.ADD_ANNOTATION,
  annotation: { ...annotation, id: Date.now() },
});

export const updateAnnotation = annotation => ({
  type: ViewerUiActions.UPDATE_ANNOTATION,
  annotation,
});

export const removeAnnotation = annotation => ({
  type: ViewerUiActions.REMOVE_ANNOTATION,
  annotation,
});

export const setAnnotations = annotations => ({
  type: ViewerUiActions.SET_ANNOTATIONS,
  annotations,
});
