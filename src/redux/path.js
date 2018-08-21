import { BindingType, ContentFormat } from '../constants/ContentConstants';
import { EMPTY_READ_LOCATION, ReaderThemeType, ViewType } from '../constants/SettingConstants';
import {
  DEFAULT_CONTENT_FOOTER_HEIGHT,
  DEFAULT_MAX_WIDTH,
  DEFAULT_VERTICAL_MARGIN,
  DEFAULT_HORIZONTAL_MARGIN,
} from '../constants/StyledConstants';

export const initialContentState = index => ({
  index,
  uri: null,
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
  fontSizeInPx: 16,       // px (12px ~ 48px)
  contentPaddingInPercent: 12, // % (0 ~ 25%)
  contentWidthInPercent: 100,  // % (50% ~ 100%)
  lineHeightInEm: 1.67,   // em (1.0 ~ 3.0)
  columnGapInPercent: 5,  // % (1% ~ 20%)
  columnsInPage: 1,
  viewType: ViewType.SCROLL,
  startWithBlankPage: 0,
  maxWidth: DEFAULT_MAX_WIDTH,
  contentFooterHeight: DEFAULT_CONTENT_FOOTER_HEIGHT,
  containerHorizontalMargin: DEFAULT_HORIZONTAL_MARGIN,
  containerVerticalMargin: DEFAULT_VERTICAL_MARGIN,
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
    location: EMPTY_READ_LOCATION,
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
