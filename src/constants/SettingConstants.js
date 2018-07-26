import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';


export const VIEWER_EMPTY_READ_POSITION = '-1#-1';
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

const _ViewerSpinType = {
  FONT_SIZE: 'font_size',
  PADDING: 'padding',
  LINE_HEIGHT: 'line_height',
};

export const ViewerSpinType = makeConstants(updateObject(_ViewerSpinType, {
  _LIST: [
    _ViewerSpinType.FONT_SIZE,
    _ViewerSpinType.PADDING,
    _ViewerSpinType.LINE_HEIGHT,
  ],
  _STRING_MAP: {
    [_ViewerSpinType.FONT_SIZE]: '글자 크기',
    [_ViewerSpinType.PADDING]: '문단 너비',
    [_ViewerSpinType.LINE_HEIGHT]: '줄 간격',
  },
}), {
  toReaderSettingType: (type) => {
    switch (type) {
      case _ViewerSpinType.FONT_SIZE:
        return 'fontSizeLevel';
      case _ViewerSpinType.PADDING:
        return 'paddingLevel';
      case _ViewerSpinType.LINE_HEIGHT:
        return 'lineHeightLevel';
      default:
        return 'fontSizeLevel';
    }
  },
});

const _ViewerComicSpinType = {
  CONTENT_WIDTH: 'width',
};

export const ViewerComicSpinType = makeConstants(updateObject(_ViewerComicSpinType, {
  _LIST: [
    _ViewerComicSpinType.CONTENT_WIDTH,
  ],
  _STRING_MAP: {
    [_ViewerComicSpinType.CONTENT_WIDTH]: '콘텐츠 너비',
  },
}), {
  toReaderSettingType: (type) => {
    switch (type) {
      case _ViewerComicSpinType.CONTENT_WIDTH:
        return 'contentWidthLevel';
      default:
        return 'contentWidthLevel';
    }
  },
});
