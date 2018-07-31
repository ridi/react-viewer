import { BindingType, ContentFormat } from '../constants/ContentConstants';
import { EMPTY_READ_POSITION, ReaderThemeType, ViewType } from '../constants/SettingConstants';
import {
  DEFAULT_CONTENT_FOOTER_HEIGHT,
  DEFAULT_MAX_WIDTH,
  DEFAULT_VERTICAL_MARGIN,
  DEFAULT_HORIZONTAL_MARGIN,
  DEFAULT_EXTENDED_SIDE_TOUCH_WIDTH,
} from '../constants/StyledConstants';

export const initialContentState = (index, uri) => ({
  index,
  uri,
  content: null,
  error: null,
  isContentLoaded: false,
  isContentOnError: false,
});

export const initialContentCalculationsState = index => ({ index, isCalculated: false, total: 0 });
export const initialFooterCalculationsState = () => ({ isCalculated: false, total: 0 });

export const initialSettingState = () => ({
  colorTheme: ReaderThemeType.WHITE,
  font: 'system',
  fontSizeLevel: 6,
  paddingLevel: 3,
  contentWidthLevel: 6,
  lineHeightLevel: 3,
  viewType: ViewType.SCROLL,
  columnsInPage: 1,
  columnGap: 40,
  startWithBlankPage: 0,
  maxWidth: DEFAULT_MAX_WIDTH,
  contentFooterHeight: DEFAULT_CONTENT_FOOTER_HEIGHT,
  containerHorizontalMargin: DEFAULT_HORIZONTAL_MARGIN,
  containerVerticalMargin: DEFAULT_VERTICAL_MARGIN,
  extendedSideTouchWidth: DEFAULT_EXTENDED_SIDE_TOUCH_WIDTH,
});

export const initialState = {
  status: {
    isInitContents: false,
    isContentsLoaded: false,
    isAllCalculated: false,
  },
  metadata: {
    format: ContentFormat.HTML,
    binding: BindingType.LEFT,
  },
  contents: [],
  calculations: {
    contents: [],
    footer: { isCalculated: false, total: 0 },
    total: 0,
  },
  current: {
    contentIndex: 1,
    location: EMPTY_READ_POSITION,
    position: 0,
    offset: 0,  // page or scroll top
    viewType: ViewType.SCROLL,
  },
  setting: initialSettingState(),
};

export default {
  contents: () => ['contents'],
  content: index => ['contents', index - 1, 'content'],
  isContentLoaded: index => ['contents', index - 1, 'isContentLoaded'],
  isContentOnError: index => ['contents', index - 1, 'isContentOnError'],
  contentError: index => ['contents', index - 1, 'error'],

  contentFormat: () => ['metadata', 'format'],
  bindingType: () => ['metadata', 'binding'],

  isInitContents: () => ['status', 'isInitContents'],
  isContentsLoaded: () => ['status', 'isContentsLoaded'],
  isAllCalculated: () => ['status', 'isAllCalculated'],

  current: () => ['current'],
  currentContentIndex: () => ['current', 'contentIndex'],
  currentPosition: () => ['current', 'position'],
  currentLocation: () => ['current', 'location'],
  currentOffset: () => ['current', 'offset'],

  setting: () => ['setting'],
  colorTheme: () => ['setting', 'colorTheme'],
  columnsInPage: () => ['setting', 'columnsInPage'],
  columnGap: () => ['setting', 'columnGap'],

  calculationsTotal: () => ['calculations', 'total'],
  contentsCalculations: () => ['calculations', 'contents'],
  isContentsCalculated: index => ['calculations', 'contents', index - 1, 'isCalculated'],
  contentCalculationsTotal: index => ['calculations', 'contents', index - 1, 'total'],
  footerCalculations: () => ['calculations', 'footer'],
  footerCalculationsTotal: () => ['calculations', 'footer', 'total'],
  isFooterCalculated: () => ['calculations', 'footer', 'isCalculated'],
};
