import makeConstants from '../../../src/util/Constant';
import { updateObject } from '../../../src/util/Util';

// 작품에 할당된 뷰어에서 가능한 보기 타입 상수
const _AvailableViewType = {
  BOTH: 0,
  SCROLL: 1,
  PAGE: 2,
};

export const AvailableViewType = makeConstants(updateObject(_AvailableViewType, {
  _LIST: [
    _AvailableViewType.BOTH,
    _AvailableViewType.SCROLL,
    _AvailableViewType.PAGE,
  ],
  _STRING_MAP: {
    [_AvailableViewType.BOTH]: '보기 방식 가능',
    [_AvailableViewType.SCROLL]: '스크롤 보기 전용',
    [_AvailableViewType.PAGE]: '페이지 보기 전용',
  },
}), {});

const _ContentType = {
  WEB_NOVEL: 10,
  COMIC: 20,
  WEBTOON: 30,
};

export const ContentType = makeConstants(updateObject(_ContentType, {
  _LIST: [
    _ContentType.WEB_NOVEL,
    _ContentType.COMIC,
    _ContentType.WEBTOON,
  ],
  _STRING_MAP: {
    [_ContentType.WEB_NOVEL]: '웹소설',
    [_ContentType.COMIC]: '만화',
    [_ContentType.WEBTOON]: '웹툰',
  },
}), {});
