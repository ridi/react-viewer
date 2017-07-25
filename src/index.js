import ViewerScreen from './views/viewerScreen/ViewerScreen';
import {
  calculatedPageViewer,
  initializeViewerScreen,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  movePageViewer,
  showCommentArea,
  viewerScreenSettingChanged,
  updateSpineMetaData,
  renderSpine
} from './redux/viewerScreen/ViewerScreen.action';
import {
  selectSpines,
  selectContentType,
  selectViewerType,
  selectBindingType,
  selectPageViewPagination,
  selectIsEndingScreen,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  selectViewerScreenSettings
} from './redux/viewerScreen/ViewerScreen.selector';
import reducers from './redux/viewerScreen/ViewerScreen.reducer';
import PageCalculator from './util/viewerScreen/PageCalculator';
import ViewerHelper from './util/viewerScreen/ViewerHelper';

const actions = {
  calculatedPageViewer,
  initializeViewerScreen,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  movePageViewer,
  showCommentArea,
  viewerScreenSettingChanged,
  updateSpineMetaData,
  renderSpine,
};

const selectors = {
  selectSpines,
  selectContentType,
  selectViewerType,
  selectBindingType,
  selectPageViewPagination,
  selectIsEndingScreen,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  selectViewerScreenSettings,
};

export default ViewerScreen;

export {
  actions,
  selectors,
  reducers,
  PageCalculator,
  ViewerHelper,

  calculatedPageViewer,
  initializeViewerScreen,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  movePageViewer,
  showCommentArea,
  viewerScreenSettingChanged,
  updateSpineMetaData,
  renderSpine,

  selectSpines,
  selectContentType,
  selectViewerType,
  selectBindingType,
  selectPageViewPagination,
  selectIsEndingScreen,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  selectViewerScreenSettings,
};
