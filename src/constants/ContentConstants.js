import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';


const _ContentType = {
  WEB_NOVEL: 10,
  COMIC: 20,
  WEBTOON: 30
};

export const ContentType = makeConstants(updateObject(_ContentType, {
  _LIST: [
    _ContentType.WEB_NOVEL,
    _ContentType.COMIC,
    _ContentType.WEBTOON
  ],
  _STRING_MAP: {
    [_ContentType.WEB_NOVEL]: '웹소설',
    [_ContentType.COMIC]: '만화',
    [_ContentType.WEBTOON]: '웹툰'
  }
}), {});

const _BindingType = {
  LEFT: 0,
  RIGHT: 1
};

export const BindingType = makeConstants(updateObject(_BindingType, {
  _LIST: [
    _BindingType.LEFT,
    _BindingType.RIGHT
  ],
  _STRING_MAP: {
    [_BindingType.LEFT]: '좌철',
    [_BindingType.RIGHT]: '우철'
  }
}), {});

// 작품에 할당된 뷰어에서 가능한 보기 타입 상수
const _AvailableViewerType = {
  BOTH: 0,
  SCROLL: 1,
  PAGE: 2
};

export const AvailableViewerType = makeConstants(updateObject(_AvailableViewerType, {
  _LIST: [
    _AvailableViewerType.BOTH,
    _AvailableViewerType.SCROLL,
    _AvailableViewerType.PAGE
  ],
  _STRING_MAP: {
    [_AvailableViewerType.BOTH]: '보기 방식 가능',
    [_AvailableViewerType.SCROLL]: '스크롤 보기 전용',
    [_AvailableViewerType.PAGE]: '페이지 보기 전용'
  }
}), {});
