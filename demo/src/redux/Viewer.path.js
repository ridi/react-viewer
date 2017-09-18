

export const initialState = {
  ui: {
    isVisibleSettingPopup: false,
    viewerSettings: {},
  },
};

export default {
  isVisibleSettingPopup: () => ['ui', 'isVisibleSettingPopup'],
  viewerSettings: () => ['ui', 'viewerSettings'],
};
