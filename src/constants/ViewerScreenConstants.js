import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';

const _ViewerThemeType = {
  WHITE: 'white_theme',
  IOS_SEPIA: 'ios_sepia_theme',
  SEPIA: 'sepia_theme',
  BLACKBOARD: 'blackboard_theme',
  DARKGRAY: 'darkgray_theme',
  BLACK: 'black_theme',
  PAPER: 'paper_theme',
  KOREAN_PAPER: 'korean_paper_theme',
};

export const ViewerThemeType = makeConstants(updateObject(_ViewerThemeType, {
  _LIST: [
    _ViewerThemeType.WHITE,
    _ViewerThemeType.IOS_SEPIA,
    _ViewerThemeType.SEPIA,
    _ViewerThemeType.BLACKBOARD,
    _ViewerThemeType.DARKGRAY,
    _ViewerThemeType.BLACK,
    _ViewerThemeType.PAPER,
    _ViewerThemeType.KOREAN_PAPER,
  ]
}), {});

const _ViewerBodyThemeColorType = {
  DEFAULT: 'default_back',
  WHITE: 'white_back',
  IOS_SEPIA: 'ios_sepia_back',
  SEPIA: 'sepia_back',
  BLACKBOARD: 'blackboard_back',
  DARKGRAY: 'darkgray_back',
  BLACK: 'black_back',
  PAPER: 'paper_back',
  KOREAN_PAPER: 'korean_paper_back',
};

export const ViewerBodyThemeColorType = makeConstants(updateObject(_ViewerBodyThemeColorType, {
  _LIST: [
    _ViewerBodyThemeColorType.DEFAULT,
    _ViewerBodyThemeColorType.WHITE,
    _ViewerBodyThemeColorType.IOS_SEPIA,
    _ViewerBodyThemeColorType.SEPIA,
    _ViewerBodyThemeColorType.BLACKBOARD,
    _ViewerBodyThemeColorType.DARKGRAY,
    _ViewerBodyThemeColorType.BLACK,
    _ViewerBodyThemeColorType.PAPER,
    _ViewerBodyThemeColorType.KOREAN_PAPER,
  ]
}), {});

const _ViewerFontType = {
  KOPUB_BATANG: 'kopub_batang',
  KOPUB_DOTUM: 'kopub_dotum',
};

export const ViewerFontType = makeConstants(updateObject(_ViewerFontType, {
  _LIST: [_ViewerFontType.KOPUB_BATANG, _ViewerFontType.KOPUB_DOTUM],
  _STRING_MAP: {
    [_ViewerFontType.KOPUB_BATANG]: 'Kopub 바탕',
    [_ViewerFontType.KOPUB_DOTUM]: 'Kopub 돋움',
  }
}), {});

// 뷰어 보기 타입 상수
const _ViewerType = {
  SCROLL: 'scroll',
  PAGE: 'page'
};

export const ViewerType = makeConstants(updateObject(_ViewerType, {
  _LIST: [_ViewerType.PAGE, _ViewerType.SCROLL],
  _STRING_MAP: {
    [_ViewerType.PAGE]: '페이지 넘김',
    [_ViewerType.SCROLL]: '스크롤 보기'
  }
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
  }
}), {
  toReaderSettingType: type => {
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
  }
});

const _ViewerComicSpinType = {
  CONTENT_WIDTH: 'width'
};

export const ViewerComicSpinType = makeConstants(updateObject(_ViewerComicSpinType, {
  _LIST: [
    _ViewerComicSpinType.CONTENT_WIDTH
  ],
  _STRING_MAP: {
    [_ViewerComicSpinType.CONTENT_WIDTH]: '콘텐츠 너비'
  }
}), {
  toReaderSettingType: type => {
    switch (type) {
      case _ViewerComicSpinType.CONTENT_WIDTH:
        return 'contentWidthLevel';
      default:
        return 'contentWidthLevel';
    }
  }
});
