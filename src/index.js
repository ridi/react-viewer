import ViewerScreen, { createStyledViewerScreen } from './views/viewerScreen/ViewerScreen';
import {
  actions,
  calculatedPageViewer,
  initializeViewerScreen,
  movePageViewer,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  renderSpine,
  updateSpineMetaData,
  viewerScreenSettingChanged,
} from './redux/viewerScreen/ViewerScreen.action';
import {
  selectBindingType,
  selectContentType,
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
import {
  ScrollScreen,
  PageScreen,
  SizingWrapper,
  PageContents,
  Pages,
  ScrollContents,
} from './styled/viewerScreen/ViewerScreen.styled';


const actionGenerators = {
  calculatedPageViewer,
  initializeViewerScreen,
  onViewerScreenScrolled,
  onViewerScreenTouched,
  movePageViewer,
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
  calculatedPageViewer, // page view 상태에서 계산된 전체 페이지 수를 반영한다.
  initializeViewerScreen, // 뷰어의 상태값을 초기화한다.
  onViewerScreenScrolled, // scroll view 상태에서 뷰어가 스크롤 되었을 떄 호출된다.
  onViewerScreenTouched, // 뷰어에 터치 입력이 들어왔을 때 호출된다.
  movePageViewer, // page view 상태에서 특정 페이지로 이동한다.
  viewerScreenSettingChanged, // 뷰어 세팅이 변경되었을 때 호출된다.
  updateSpineMetaData, // meta data (contentType, viewerType, bindingType) 을 업데이트한다.
  renderSpine, // spine 데이터를 업데이트한다.

  // selectors
  selectSpines, // spine 데이터를 가져온다.
  selectContentType, // meta data 중 contentType 을 가져온다.
  selectViewerType, // meta data 중 viewerType 을 가져온다.
  selectBindingType, // meta data 중 bindingType 을 가져온다.
  selectPageViewPagination, // page view 상태에서 pagination 데이터를 가져온다. (totalPage, currentPage)
  selectIsFullScreen, // header 와 footer 가 비활성화된 full screen 상태인지 여부를 가져온다.
  selectIsLoadingCompleted, // spine 의 로딩 완료 여부를 가져온다.
  selectViewerScreenSettings, // 뷰어 세팅값들을 가져온다.
  selectViewerReadPosition, // 마지막으로 읽은 위치 값을 가져온다.

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

  // higher-order components
  createStyledViewerScreen,

  // default styled components
  ScrollScreen,
  PageScreen,
  SizingWrapper,
  PageContents,
  Pages,
  ScrollContents,
};
