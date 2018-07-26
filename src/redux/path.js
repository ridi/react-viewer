import { BindingType, ContentFormat } from '../constants/ContentConstants';
import { ReaderThemeType, ViewType } from '../constants/SettingConstants';
import { CONTENT_FOOTER_HEIGHT, PAGE_MAX_WIDTH } from '../constants/StyledConstants';

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
  maxWidth: PAGE_MAX_WIDTH,
  contentFooterHeight: CONTENT_FOOTER_HEIGHT,
  containerHorizontalMargin: 15,
  containerVerticalMargin: 50,
  startWithBlankPage: 0,
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
    footer: {
      isCalculated: false,
      total: 0,
    },
    total: 0,
  },
  current: {
    contentIndex: 1,
    position: 0, // EMPTY_READ_POSITION TODO reader.js 연동 필요, 현재는 일단 spine 내 %로 저장하고 있음
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
