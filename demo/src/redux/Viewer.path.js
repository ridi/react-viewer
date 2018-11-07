import { AvailableViewType } from '../constants/ContentConstants';

export const setAnnotation = (annotations, annotation, isRemoved = false) => {
  const dupAnnotations = [...annotations];
  const index = dupAnnotations.findIndex(({ id }) => id === annotation.id);
  if (index >= 0) {
    if (isRemoved) {
      dupAnnotations.splice(index, 1);
      return dupAnnotations;
    }
    return dupAnnotations.map((a, i) => (i === index ? annotation : a));
  }
  dupAnnotations.push(annotation);
  return dupAnnotations;
};

export const initialState = {
  ui: {
    isVisibleSettingPopup: false,
    viewerSettings: {},
    isFullScreen: false,
    availableViewType: AvailableViewType.BOTH,
  },
  annotations: [],
};

export default {
  isVisibleSettingPopup: () => ['ui', 'isVisibleSettingPopup'],
  viewerSettings: () => ['ui', 'viewerSettings'],
  isFullScreen: () => ['ui', 'isFullScreen'],
  availableViewType: () => ['ui', 'availableViewType'],
  annotations: () => ['annotations'],
};
