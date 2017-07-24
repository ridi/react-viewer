

export const actions = {
  INITIALIZE_VIEWER_SCREEN: 'VIEWER_SCREEN:INITIALIZE',
  TOUCH_VIEWER_SCREEN: 'VIEWER_SCREEN:TOUCH',
  SCROLLED_VIEWER_SCREEN: 'VIEWER_SCREEN:SCROLLED',
  VIEWER_SCREEN_SETTING_CHANGED: 'VIEWER_SCREEN:SETTING_CHANGED',
  UPDATE_SPINE_META_DATA: 'VIEWER_SCREEN:UPDATE_SPINE_META_DATA',
  RENDER_SPINE: 'VIEWER_SCREEN:RENDER_SPINE',
  CALCULATED_PAGE_VIEWER: 'PAGE_VIEWER:CALCULATED_PAGE',
  MOVE_PAGE_VIEWER: 'PAGE_VIEWER:MOVE',
  SHOW_ENDING_SCREEN: 'PAGE_VIEWER:SHOW_ENDING_SCREEN',
};

export const initializeViewerScreen = viewerScreenSettings => ({
  type: actions.INITIALIZE_VIEWER_SCREEN,
  viewerScreenSettings,
});

export const onViewerScreenTouched = () => ({
  type: actions.TOUCH_VIEWER_SCREEN,
});

export const onViewerScreenScrolled = () => ({
  type: actions.SCROLLED_VIEWER_SCREEN,
});

export const calculatedPageViewer = page => ({
  type: actions.CALCULATED_PAGE_VIEWER,
  page,
});

export const movePageViewer = number => ({
  type: actions.MOVE_PAGE_VIEWER,
  number,
});

export const showCommentArea = () => ({
  type: actions.SHOW_ENDING_SCREEN,
});

export const viewerScreenSettingChanged = changedSetting => ({
  type: actions.VIEWER_SCREEN_SETTING_CHANGED,
  changedSetting,
});

export const updateSpineMetaData = (contentType, viewerType, bindingType) => ({
  type: actions.UPDATE_SPINE_META_DATA,
  contentType,
  viewerType,
  bindingType,
});

export const renderSpine = (index, spine) => ({
  type: actions.RENDER_SPINE,
  index,
  spine,
});
