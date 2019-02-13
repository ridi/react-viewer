import { BindingType, ContentFormat, PRE_CALCULATED_RATIO } from '../constants/ContentConstants';
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
  isInScreen: false,
  ratio: PRE_CALCULATED_RATIO,
});

export const initialContentCalculationsState = (
  index,
  startOffset = 0,
  offset = (index === 1 ? startOffset : PRE_CALCULATION),
  total = PRE_CALCULATION,
) => ({
  index,
  isCalculated: offset !== PRE_CALCULATION && total !== PRE_CALCULATION,
  offset,
  total,
});

export const initialFooterCalculationsState = (offset = PRE_CALCULATION, total = PRE_CALCULATION) => ({
  isCalculated: offset !== PRE_CALCULATION && total !== PRE_CALCULATION,
  offset,
  total,
});

export const initialSettingState = () => ({
  colorTheme: ReaderThemeType.WHITE,
  font: 'system',
  fontSizeInEm: 1,       // em (0.1em ~ 5.0em)
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

export const initialCalculationsState = () => ({
  contents: [],
  footer: initialFooterCalculationsState(),
  contentTotal: PRE_CALCULATION,
  targets: [],
});

export const initialState = () => ({
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
  calculations: initialCalculationsState(),
  current: {
    contentIndex: 1,
    location: EMPTY_READ_LOCATION,
    position: 0,
    offset: 0,  // page or scroll top
    viewType: ViewType.SCROLL,
    viewPortRange: [],
  },
  setting: initialSettingState(),
});

export default {
  contents: () => ['contents'],
  content: index => ['contents', index - 1, 'content'],
  contentRatio: index => ['contents', index - 1, 'ratio'],
  isContentLoaded: index => ['contents', index - 1, 'isContentLoaded'],
  isContentOnError: index => ['contents', index - 1, 'isContentOnError'],
  contentError: index => ['contents', index - 1, 'error'],

  metadata: () => ['metadata'],
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

  calculations: () => ['calculations'],
  calculationsTotal: () => ['calculations', 'contentTotal'],
  contentsCalculations: () => ['calculations', 'contents'],
  contentsCalculation: index => ['calculations', 'contents', index - 1],
  isContentsCalculated: index => ['calculations', 'contents', index - 1, 'isCalculated'],
  contentCalculationsTotal: index => ['calculations', 'contents', index - 1, 'total'],
  footerCalculations: () => ['calculations', 'footer'],
  footerCalculationsTotal: () => ['calculations', 'footer', 'total'],
  isFooterCalculated: () => ['calculations', 'footer', 'isCalculated'],
  calculationsTargets: () => ['calculations', 'targets'],
};
