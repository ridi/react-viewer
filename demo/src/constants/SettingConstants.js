import makeConstants from '../../../src/util/Constant';
import { updateObject } from '../../../src/util/Util';

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
    [_ViewerSpinType.FONT_SIZE]: '글자 크기(px)',
    [_ViewerSpinType.PADDING]: '문단 좌우 패딩(%)',
    [_ViewerSpinType.LINE_HEIGHT]: '줄 간격(em)',
  },
}), {
  toReaderSettingType: (type) => {
    switch (type) {
      case _ViewerSpinType.FONT_SIZE:
        return 'fontSizeInPx';
      case _ViewerSpinType.PADDING:
        return 'contentPaddingInPercent';
      case _ViewerSpinType.LINE_HEIGHT:
        return 'lineHeightInEm';
      default:
        return 'fontSizeInPx';
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
    [_ViewerComicSpinType.CONTENT_WIDTH]: '콘텐츠 너비(%)',
  },
}), {
  toReaderSettingType: (type) => {
    switch (type) {
      case _ViewerComicSpinType.CONTENT_WIDTH:
        return 'contentWidthInPercent';
      default:
        return 'contentWidthInPercent';
    }
  },
});
