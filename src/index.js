import ViewerScreen from './views/viewerScreen/ViewerScreen';
import {
  actions,
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
import ReadPositionHelper from './util/viewerScreen/ReadPositionHelper';
import { ContentType, BindingType, AvailableViewerType } from './constants/ContentConstants';
import {
  ViewerThemeType,
  ViewerBodyThemeColorType,
  ViewerFontType,
  ViewerType,
  ViewerSpinType,
  ViewerComicSpinType
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
