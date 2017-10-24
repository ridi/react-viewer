import ViewerScreen from './views/viewerScreen/ViewerScreen';
import {
  actions,
  calculatedPageViewer,
  initializeViewerScreen,
  movePageViewer,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  renderSpine,
  showCommentArea,
  updateSpineMetaData,
  viewerScreenSettingChanged,
} from './redux/viewerScreen/ViewerScreen.action';
import {
  selectBindingType,
  selectContentType,
  selectIsEndingScreen,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  selectPageViewPagination,
  selectSpines,
  selectViewerReadPosition,
  selectViewerScreenSettings,
  selectViewerType,
} from './redux/viewerScreen/ViewerScreen.selector';
import reducers from './redux/viewerScreen/ViewerScreen.reducer';
import PageCalculator from './util/viewerScreen/PageCalculator';
import ViewerHelper from './util/viewerScreen/ViewerHelper';
import ReadPositionHelper from './util/viewerScreen/ReadPositionHelper';
import { AvailableViewerType, BindingType, ContentType } from './constants/ContentConstants';
import {
  ViewerBodyThemeColorType,
  ViewerComicSpinType,
  ViewerFontType,
  ViewerSpinType,
  ViewerThemeType,
  ViewerType,
} from './constants/ViewerScreenConstants';


const actionGenerators = {
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
  actionGenerators,
  selectors,
  reducers,
  PageCalculator,
  ViewerHelper,
  ReadPositionHelper,

  // actions
  calculatedPageViewer,
  initializeViewerScreen,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  movePageViewer,
  showCommentArea,
  viewerScreenSettingChanged,
  updateSpineMetaData,
  renderSpine,

  // selectors
  selectSpines,
  selectContentType,
  selectViewerType,
  selectBindingType,
  selectPageViewPagination,
  selectIsEndingScreen,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  selectViewerScreenSettings,
  selectViewerReadPosition,

  // constants
  ContentType,
  BindingType,
  AvailableViewerType,
  ViewerThemeType,
  ViewerBodyThemeColorType,
  ViewerFontType,
  ViewerType,
  ViewerSpinType,
  ViewerComicSpinType,
};
