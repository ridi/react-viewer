import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';


export const EMPTY_READ_POSITION = '-1#-1';
export const INVALID_PAGE = -1;

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
