import { createSelector } from 'reselect';
import path from './Viewer.path';
import { nullSafeGet } from '../../../src/util/Util';


const getViewer = state => state.viewer || {};

export const selectIsVisibleSettingPopup = createSelector(
  [getViewer],
  viewer => nullSafeGet(viewer, path.isVisibleSettingPopup(), false)
);
