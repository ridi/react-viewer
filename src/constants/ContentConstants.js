import makeConstants from '../util/Constant';
import { updateObject } from '../util/Util';

const _BindingType = {
  LEFT: 0,
  RIGHT: 1,
};

export const BindingType = makeConstants(updateObject(_BindingType, {
  _LIST: [
    _BindingType.LEFT,
    _BindingType.RIGHT,
  ],
  _STRING_MAP: {
    [_BindingType.LEFT]: '좌철',
    [_BindingType.RIGHT]: '우철',
  },
}), {});

// 렌더링 방식을 결정하는 콘텐츠 데이터 포맷
const _ContentFormat = {
  HTML: 0,
  IMAGE: 1,
};

export const ContentFormat = makeConstants(updateObject(_ContentFormat, {
  _LIST: [
    _ContentFormat.HTML,
    _ContentFormat.IMAGE,
  ],
  _STRING_MAP: {
    [_ContentFormat.HTML]: 'EPUB',
    [_ContentFormat.IMAGE]: '이미지',
  },
}), {});
