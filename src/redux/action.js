
export const actions = {
  TOUCHED: 'READER:TOUCHED',
  SCROLLED: 'READER:SCROLLED',
  SET_CONTENTS: 'READER:SET_CONTENTS',
  UPDATE_SETTING: 'READER:UPDATE_SETTING',
  UPDATE_METADATA: 'READER:UPDATE_METADATA',
  UPDATE_CURRENT: 'READER:UPDATE_CURRENT',
  UPDATE_CONTENT: 'READER:UPDATE_CONTENT',
  UPDATE_CONTENT_ERROR: 'READER:UPDATE_CONTENT_ERROR',
  INVALIDATE_CALCULATIONS: 'READER:INVALIDATE_CALCULATIONS',
  UPDATE_CONTENT_CALCULATIONS: 'READER:UPDATE_CONTENT_CALCULATIONS',
  UPDATE_FOOTER_CALCULATIONS: 'READER:COMPLETE_FOOTER_CALCULATIONS',
  UPDATE_CALCULATIONS_TOTAL: 'READER:UPDATE_CALCULATIONS_TOTAL',
};

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

export const updateMetadata = (contentType, viewType, bindingType) => ({
  type: actions.UPDATE_METADATA,
  contentType,
  viewType,
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
