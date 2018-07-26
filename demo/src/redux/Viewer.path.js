import { AvailableViewType } from '../constants/ContentConstants';

export const initialState = {
  ui: {
    isVisibleSettingPopup: false,
    viewerSettings: {},
    isFullScreen: false,
    availableViewType: AvailableViewType.BOTH,
  },

};

export default {
  isVisibleSettingPopup: () => ['ui', 'isVisibleSettingPopup'],
  viewerSettings: () => ['ui', 'viewerSettings'],
  isFullScreen: () => ['ui', 'isFullScreen'],
  availableViewType: () => ['ui', 'availableViewType'],
};
