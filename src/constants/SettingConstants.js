import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';

export const CONTENT_WRAPPER = '.content_container';
export const SELECTION_BASE_CONTENT = 'reader_contents';
export const EMPTY_READ_LOCATION = '-1#-1';
export const INVALID_PAGE = -1;
export const INVALID_OFFSET = -1;

export const FONT_SIZE_RANGE = [12.0, 48.0];
export const CONTENT_PADDING_RANGE = [0.0, 25.0];
export const CONTENT_WIDTH_RANGE = [50.0, 100.0];
export const LINE_HEIGHT_RANGE = [1.0, 3.0];
export const COLUMN_GAP_RANGE = [1.0, 20.0];

const _ReaderThemeType = {
  WHITE: 'white_theme',
  IOS_SEPIA: 'ios_sepia_theme',
  SEPIA: 'sepia_theme',
  BLACKBOARD: 'blackboard_theme',
  DARKGRAY: 'darkgray_theme',
  BLACK: 'black_theme',
  PAPER: 'paper_theme',
  KOREAN_PAPER: 'korean_paper_theme',
};

export const ReaderThemeType = makeConstants(updateObject(_ReaderThemeType, {
  _LIST: [
    _ReaderThemeType.WHITE,
    _ReaderThemeType.IOS_SEPIA,
    _ReaderThemeType.SEPIA,
    _ReaderThemeType.BLACKBOARD,
    _ReaderThemeType.DARKGRAY,
    _ReaderThemeType.BLACK,
    _ReaderThemeType.PAPER,
    _ReaderThemeType.KOREAN_PAPER,
  ],
}), {});

// 뷰어 보기 타입 상수
const _ViewType = {
  SCROLL: 'scroll',
  PAGE: 'page',
};

export const ViewType = makeConstants(updateObject(_ViewType, {
  _LIST: [_ViewType.PAGE, _ViewType.SCROLL],
  _STRING_MAP: {
    [_ViewType.PAGE]: '페이지 넘김',
    [_ViewType.SCROLL]: '스크롤 보기',
  },
}), {});
