export const ViewerUiActions = {
  TOGGLE_VIEWER_SETTING: 'VIEWER_FOOTER:TOGGLE_SETTING',
  VIEWER_SETTING_CHANGED: 'VIEWER:SETTING_CHANGED',
  TOUCHED: 'VIEWER:TOUCHED',
  SCROLLED: 'VIEWER:SCROLLED',
  ADD_ANNOTATION: 'VIEWER:ADD_ANNOTATION',
  UPDATE_ANNOTATION: 'VIEWER:SET_ANNOTATION',
  SET_ANNOTATIONS: 'VIEWER:SET_ANNOTATIONS',
  REMOVE_ANNOTATION: 'VIEWER:REMOVE_ANNOTATION',
  SET_CONTEXT_MENU: 'VIEWER:SET_CONTEXT_MENU',
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

export const onScreenTouched = () => ({
  type: ViewerUiActions.TOUCHED,
});

export const onScreenScrolled = () => ({
  type: ViewerUiActions.SCROLLED,
});

export const addAnnotation = annotation => ({
  type: ViewerUiActions.ADD_ANNOTATION,
  annotation: { ...annotation, id: String(Date.now()) },
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

export const setContextMenu = (isVisible, target = null) => ({
  type: ViewerUiActions.SET_CONTEXT_MENU,
  isVisible,
  target,
});
