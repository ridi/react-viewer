
export const actions = {
  INITIALIZED: 'VIEWER:INITIALIZED',
  TOUCHED: 'VIEWER:TOUCHED',
  SCROLLED: 'VIEWER:SCROLLED',
  SET_CONTENTS: 'VIEWER:SET_CONTENTS',
  UPDATE_SETTING: 'VIEWER:UPDATE_SETTING',
  UPDATE_METADATA: 'VIEWER:UPDATE_METADATA',
  UPDATE_CURRENT: 'VIEWER:UPDATE_CURRENT',
  UPDATE_CONTENT: 'VIEWER:UPDATE_CONTENT',
  UPDATE_CONTENT_ERROR: 'VIEWER:UPDATE_CONTENT_ERROR',
  INVALIDATE_CALCULATIONS: 'VIEWER:INVALIDATE_CALCULATIONS',
  UPDATE_CONTENT_CALCULATIONS: 'VIEWER:UPDATE_CONTENT_CALCULATIONS',
  UPDATE_FOOTER_CALCULATIONS: 'VIEWER:COMPLETE_FOOTER_CALCULATIONS',
  UPDATE_CALCULATIONS_TOTAL: 'VIEWER:UPDATE_CALCULATIONS_TOTAL',
};

export const initializeViewerScreen = setting => ({
  type: actions.INITIALIZED,
  setting,
});

export const onScreenTouched = () => ({
  type: actions.TOUCHED,
});

export const onScreenScrolled = () => ({
  type: actions.SCROLLED,
});

export const setContents = (format, contents) => ({
  type: actions.SET_CONTENTS,
  format,
  contents,
});

export const updateCurrent = current => ({
  type: actions.UPDATE_CURRENT,
  current,
});

export const updateSetting = setting => ({
  type: actions.UPDATE_SETTING,
  setting,
});

export const updateMetadata = (contentType, viewerType, bindingType) => ({
  type: actions.UPDATE_METADATA,
  contentType,
  viewerType,
  bindingType,
});

export const updateContent = (index, content, isAllLoaded = false) => ({
  type: actions.UPDATE_CONTENT,
  index,
  content,
  isAllLoaded,
});

export const updateContentError = (index, error, isAllLoaded = false) => ({
  type: actions.UPDATE_CONTENT_ERROR,
  index,
  error,
  isAllLoaded,
});

export const invalidateCalculations = () => ({
  type: actions.INVALIDATE_CALCULATIONS,
});

export const updateContentCalculations = (index, total) => ({
  type: actions.UPDATE_CONTENT_CALCULATIONS,
  index,
  total,
});

export const updateFooterCalculation = total => ({
  type: actions.UPDATE_FOOTER_CALCULATIONS,
  total,
});

export const updateCalculationsTotal = (calculationsTotal, isCompleted = false) => ({
  type: actions.UPDATE_CALCULATIONS_TOTAL,
  calculationsTotal,
  isCompleted,
});
