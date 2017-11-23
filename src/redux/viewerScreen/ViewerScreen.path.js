import { AvailableViewerType, BindingType, ContentType } from '../../constants/ContentConstants';
import { VIEWER_EMPTY_READ_POSITION, ViewerFontType, ViewerThemeType, ViewerType } from '../../constants/ViewerScreenConstants';


export const initialState = {
  spines: {},
  contentType: ContentType.WEB_NOVEL,
  viewerType: AvailableViewerType.SCROLL,
  bindingType: BindingType.LEFT,
  readPosition: VIEWER_EMPTY_READ_POSITION,
  isLoadingCompleted: false,
  isFullScreen: false,
  pageView: {
    calculatedPage: {
      currentPage: 1,
      totalPage: 1,
      readProcess: 0,
    },
  },
  viewerScreenSettings: {
    colorTheme: ViewerThemeType.WHITE,
    font: ViewerFontType.KOPUB_DOTUM,
    fontSizeLevel: 6,
    paddingLevel: 3,
    contentWidthLevel: 6,
    lineHeightLevel: 3,
    viewerType: ViewerType.SCROLL,
  },
};

export default {
  spines: () => ['spines'],
  spine: index => ['spines', index],
  contentType: () => ['contentType'],
  viewerType: () => ['viewerType'],
  bindingType: () => ['bindingType'],
  isLoadingCompleted: () => ['isLoadingCompleted'],
  isFullScreen: () => ['isFullScreen'],
  readPosition: () => ['readPosition'],
  pageView: () => ['ui', 'pageView'],
  pageViewPagination: () => ['pageView', 'calculatedPage'],
  pageViewTotalPage: () => ['pageView', 'calculatedPage', 'totalPage'],
  pageViewCurrentPage: () => ['pageView', 'calculatedPage', 'currentPage'],
  pageViewReadProcess: () => ['pageView', 'calculatedPage', 'readProcess'],
  viewerScreenSettings: () => ['viewerScreenSettings'],
  viewerScreenColorTheme: () => ['viewerScreenSettings', 'colorTheme'],
};
