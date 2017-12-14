import {
  AvailableViewerType,
  BindingType,
  ContentType,
  ContentFormat,
} from '../../constants/ContentConstants';
import {
  VIEWER_EMPTY_READ_POSITION,
  INVALID_PAGE,
  ViewerFontType,
  ViewerThemeType,
  ViewerType,
} from '../../constants/ViewerScreenConstants';

export const initialState = {
  content: {
    format: ContentFormat.EPUB,
    spines: {},
    images: [],
  },
  contentType: ContentType.WEB_NOVEL,
  viewerType: AvailableViewerType.SCROLL,
  bindingType: BindingType.LEFT,
  readPosition: VIEWER_EMPTY_READ_POSITION,
  isLoadingCompleted: false,
  isFullScreen: false,
  pageView: {
    calculatedPage: {
      currentPage: 1,
      totalPage: INVALID_PAGE,
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
  content: () => ['content'],
  spines: () => ['content', 'spines'],
  spine: index => ['content', 'spines', index],
  images: () => ['content', 'images'],
  contentFormat: () => ['content', 'format'],
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
  viewerScreenSettings: () => ['viewerScreenSettings'],
  viewerScreenColorTheme: () => ['viewerScreenSettings', 'colorTheme'],
};
