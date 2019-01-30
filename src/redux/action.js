import { isExist } from '../util/Util';
import {
  COLUMN_GAP_RANGE,
  CONTENT_PADDING_RANGE,
  CONTENT_WIDTH_RANGE,
  FONT_SIZE_RANGE,
  LINE_HEIGHT_RANGE,
} from '../constants/SettingConstants';

export const actions = {
  LOAD: 'READER:LOAD',
  UNLOAD: 'READER:UNLOAD',
  SET_CONTENT_METADATA: 'READER:SET_CONTENT_METADATA',
  SET_CONTENTS_BY_URI: 'READER:SET_CONTENTS_BY_URI',
  SET_CONTENTS_BY_VALUE: 'READER:SET_CONTENTS_BY_VALUE',
  SET_READY_TO_READ: 'READER:SET_READY_TO_READ',
  UPDATE_SETTING: 'READER:UPDATE_SETTING',
  UPDATE_CURRENT: 'READER:UPDATE_CURRENT',
  UPDATE_CONTENT: 'READER:UPDATE_CONTENT',
  UPDATE_CONTENT_ERROR: 'READER:UPDATE_CONTENT_ERROR',
  INVALIDATE_CALCULATIONS: 'READER:INVALIDATE_CALCULATIONS',
  UPDATE_CONTENT_CALCULATIONS: 'READER:UPDATE_CONTENT_CALCULATIONS',
  UPDATE_FOOTER_CALCULATIONS: 'READER:UPDATE_FOOTER_CALCULATIONS',
  UPDATE_CALCULATIONS_TOTAL: 'READER:UPDATE_CALCULATIONS_TOTAL',
  SET_CALCULATIONS: 'READER:SET_CALCULATIONS',
  UPDATE_SELECTION: 'READER:UPDATE_SELECTION',
  SET_CALCULATIONS_TARGETS: 'READER:SET_CALCULATIONS_TARGETS',
  SET_CONTENTS_IN_SCREEN: 'READER:SET_CONTENTS_IN_SCREEN',
};

export const load = fullState => ({
  type: actions.LOAD,
  state: fullState,
});

export const unload = () => ({
  type: actions.UNLOAD,
});

export const setContentMetadata = (contentFormat, bindingType, contentCount) => ({
  type: actions.SET_CONTENT_METADATA,
  contentFormat,
  bindingType,
  contentCount,
});

export const setContentsByValue = (contentFormat, bindingType, contents) => ({
  type: actions.SET_CONTENTS_BY_VALUE,
  contentFormat,
  bindingType,
  contents: contents.map(content => ({ content, isContentLoaded: true })),
});

export const setContentsByUri = (contentFormat, bindingType, uris) => ({
  type: actions.SET_CONTENTS_BY_URI,
  contentFormat,
  bindingType,
  contents: uris.map(uri => ({ uri, isContentLoaded: false })),
});

export const updateCurrent = current => ({
  type: actions.UPDATE_CURRENT,
  current,
});

export const updateSetting = (setting) => {
  const valid = {};
  if (isExist(setting.fontSizeInEm)) {
    valid.fontSizeInEm = Math.min(
      Math.max(setting.fontSizeInEm, FONT_SIZE_RANGE[0]),
      FONT_SIZE_RANGE[1],
    );
  }
  if (isExist(setting.contentPaddingInPercent)) {
    valid.contentPaddingInPercent = Math.min(
      Math.max(setting.contentPaddingInPercent, CONTENT_PADDING_RANGE[0]),
      CONTENT_PADDING_RANGE[1],
    );
  }
  if (isExist(setting.contentWidthInPercent)) {
    valid.contentWidthInPercent = Math.min(
      Math.max(setting.contentWidthInPercent, CONTENT_WIDTH_RANGE[0]),
      CONTENT_WIDTH_RANGE[1],
    );
  }
  if (isExist(setting.lineHeightInEm)) {
    valid.lineHeightInEm = Math.min(
      Math.max(setting.lineHeightInEm, LINE_HEIGHT_RANGE[0]),
      LINE_HEIGHT_RANGE[1],
    );
  }
  if (isExist(setting.columnGapInPercent)) {
    valid.columnGapInPercent = Math.min(
      Math.max(setting.columnGapInPercent, COLUMN_GAP_RANGE[0]),
      COLUMN_GAP_RANGE[1],
    );
  }
  return {
    type: actions.UPDATE_SETTING,
    setting: { ...setting, ...valid },
  };
};

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

export const updateContentCalculation = calculation => ({
  type: actions.UPDATE_CONTENT_CALCULATIONS,
  calculation,
});

export const updateFooterCalculation = calculation => ({
  type: actions.UPDATE_FOOTER_CALCULATIONS,
  calculation,
});

export const updateCalculationsTotal = (calculationsTotal, isCompleted = false) => ({
  type: actions.UPDATE_CALCULATIONS_TOTAL,
  calculationsTotal,
  isCompleted,
});

export const setReadyToRead = isReadyToRead => ({
  type: actions.SET_READY_TO_READ,
  isReadyToRead,
});

export const updateSelection = selection => ({
  type: actions.UPDATE_SELECTION,
  selection,
});

export const setCalculationsTargets = targets => ({
  type: actions.SET_CALCULATIONS_TARGETS,
  targets,
});

export const setContentsInScreen = contentIndexes => ({
  type: actions.SET_CONTENTS_IN_SCREEN,
  contentIndexes,
});

export const setCalculations = calculations => ({
  type: actions.SET_CALCULATIONS,
  calculations,
});
