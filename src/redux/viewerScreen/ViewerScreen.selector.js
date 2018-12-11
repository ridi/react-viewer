import { createSelector } from 'reselect';
import path from './ViewerScreen.path';
import { nullSafeGet } from '../../util/Util';
import { AvailableViewerType, BindingType, ContentType, ContentFormat } from '../../constants/ContentConstants';
import { VIEWER_EMPTY_READ_POSITION, ViewerThemeType } from '../../constants/ViewerScreenConstants';


const getViewerScreen = state => state.viewerScreen || {};

export const selectContent = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.content(), {}),
);

export const selectSpines = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.spines(), {}),
);

export const selectImages = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.images(), []),
);

export const selectContentFormat = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.contentFormat(), ContentFormat.EPUB),
);

export const selectContentType = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.contentType(), ContentType.WEB_NOVEL),
);

export const selectViewerType = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.viewerType(), AvailableViewerType.SCROLL),
);

export const selectBindingType = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.bindingType(), BindingType.LEFT),
);

export const selectPageViewPagination = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.pageViewPagination(), null),
);

export const selectIsFullScreen = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.isFullScreen(), false),
);

export const selectIsLoadingCompleted = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.isLoadingCompleted(), false),
);

export const selectViewerScreenSettings = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.viewerScreenSettings(), {}),
);

export const selectViewerReadPosition = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.readPosition(), VIEWER_EMPTY_READ_POSITION),
);

export const selectViewerScreenColorTheme = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.viewerScreenColorTheme(), ViewerThemeType.WHITE),
);
