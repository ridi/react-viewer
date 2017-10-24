import { createSelector } from 'reselect';
import path from './ViewerScreen.path';
import { nullSafeGet } from '../../util/Util';
import { AvailableViewerType, BindingType, ContentType } from '../../constants/ContentConstants';
import { VIEWER_EMPTY_READ_POSITION } from '../../constants/ViewerScreenConstants';


const getViewerScreen = state => state.viewerScreen || {};

export const selectSpines = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.spines(), {}),
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

export const selectIsEndingScreen = createSelector(
  [getViewerScreen],
  viewerScreen => nullSafeGet(viewerScreen, path.isEndingScreen(), false),
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
