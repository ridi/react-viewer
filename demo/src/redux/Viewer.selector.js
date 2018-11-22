import { createSelector } from 'reselect';
import path, { initialState } from './Viewer.path';
import { nullSafeGet } from '../../../src/util/Util';


const getViewer = state => state.viewer || {};

export const selectIsVisibleSettingPopup = createSelector(
  [getViewer],
  viewer => nullSafeGet(viewer, path.isVisibleSettingPopup(), false),
);

export const selectIsFullScreen = createSelector(
  [getViewer],
  viewer => nullSafeGet(viewer, path.isFullScreen(), false),
);

export const selectAnnotations = createSelector(
  [getViewer],
  viewer => nullSafeGet(viewer, path.annotations(), []),
);

export const selectContextMenu = createSelector(
  [getViewer],
  viewer => nullSafeGet(viewer, path.contextMenu(), initialState.ui.contextMenu),
);
