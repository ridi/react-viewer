import { createSelector } from 'reselect';
import path from './path';
import { nullSafeGet } from '../util/Util';
import { AvailableViewerType, BindingType, ContentType, ContentFormat } from '../constants/ContentConstants';

const getReader = state => state.reader || {};

export const selectContents = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.contents(), []),
);

export const selectContentFormat = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.contentFormat(), ContentFormat.HTML),
);

export const selectContentType = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.contentType(), ContentType.WEB_NOVEL),
);

export const selectAvailableViewerType = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.availableViewerType(), AvailableViewerType.BOTH),
);

export const selectBindingType = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.bindingType(), BindingType.LEFT),
);

// TODO remove?
export const selectIsFullScreen = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.isFullScreen(), false),
);

export const selectSetting = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.setting(), {}),
);

export const selectCurrent = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.current(), {}),
);

export const selectCurrentContentIndex = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.currentContentIndex(), 1),
);

export const selectCurrentOffset = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.currentOffset(), 0),
);

export const selectContentsCalculations = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.contentsCalculations(), []),
);

export const selectIsCalculated = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.isAllCalculated(), false),
);

export const selectCalculationsTotal = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.calculationsTotal(), 0),
);

export const selectFooterCalculations = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.footerCalculations(), {}),
);

export const selectIsInitContents = createSelector(
  [getReader],
  reader => nullSafeGet(reader, path.isInitContents(), false),
);
