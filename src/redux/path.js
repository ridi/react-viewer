import { BindingType, ContentFormat } from '../constants/ContentConstants';
import { EMPTY_READ_LOCATION, ReaderThemeType, ViewType } from '../constants/SettingConstants';
import {
  DEFAULT_CONTENT_FOOTER_HEIGHT,
  DEFAULT_MAX_WIDTH,
  DEFAULT_VERTICAL_MARGIN,
  DEFAULT_HORIZONTAL_MARGIN,
} from '../constants/StyledConstants';
import { PRE_CALCULATION } from '../constants/CalculationsConstants';

export const initialContentState = index => ({
  index,
  uri: null,
  content: null,
  error: null,
  isContentLoaded: false,
  isContentOnError: false,
});

export const initialContentCalculationsState = index => ({
  index,
  isCalculated: false,
  offset: index === 1 ? 0 : PRE_CALCULATION,
  total: 0,
});
export const initialFooterCalculationsState = () => ({ isCalculated: false, offset: PRE_CALCULATION, total: 0 });

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
    isLoaded: true,
    isInitContents: false,
    isContentsLoaded: false,
    isAllCalculated: false,
    isReadyToRead: false, // current.contentIndex 가 읽을 수 있는 상태(isCalculated = true)가 되었는지를 표시
  },
  metadata: {
    format: ContentFormat.HTML,
    binding: BindingType.LEFT,
  },
  contents: [],
  calculations: {
    contents: [],
    footer: initialFooterCalculationsState(),
    contentTotal: 0,
  },
  current: {
    contentIndex: 1,
    location: EMPTY_READ_LOCATION,
    position: 0,
    offset: 0,  // page or scroll top
    viewType: ViewType.SCROLL,
  },
  setting: initialSettingState(),
  selection: null,
};

export default {
  contents: () => ['contents'],
  content: index => ['contents', index - 1, 'content'],
  isContentLoaded: index => ['contents', index - 1, 'isContentLoaded'],
  isContentOnError: index => ['contents', index - 1, 'isContentOnError'],
  contentError: index => ['contents', index - 1, 'error'],

  contentFormat: () => ['metadata', 'format'],
  bindingType: () => ['metadata', 'binding'],

  isLoaded: () => ['status', 'isLoaded'],
  isInitContents: () => ['status', 'isInitContents'],
  isContentsLoaded: () => ['status', 'isContentsLoaded'],
  isAllCalculated: () => ['status', 'isAllCalculated'],
  isReadyToRead: () => ['status', 'isReadyToRead'],

  current: () => ['current'],
  currentContentIndex: () => ['current', 'contentIndex'],
  currentPosition: () => ['current', 'position'],
  currentLocation: () => ['current', 'location'],
  currentOffset: () => ['current', 'offset'],

  setting: () => ['setting'],
  colorTheme: () => ['setting', 'colorTheme'],
  columnsInPage: () => ['setting', 'columnsInPage'],
  columnGap: () => ['setting', 'columnGap'],

  calculationsTotal: () => ['calculations', 'contentTotal'],
  contentsCalculations: () => ['calculations', 'contents'],
  contentsCalculation: index => ['calculations', 'contents', index - 1],
  isContentsCalculated: index => ['calculations', 'contents', index - 1, 'isCalculated'],
  contentCalculationsTotal: index => ['calculations', 'contents', index - 1, 'total'],
  footerCalculations: () => ['calculations', 'footer'],
  footerCalculationsTotal: () => ['calculations', 'footer', 'total'],
  isFooterCalculated: () => ['calculations', 'footer', 'isCalculated'],

  selection: () => ['selection'],
};
