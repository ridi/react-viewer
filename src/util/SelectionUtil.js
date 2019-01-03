/* eslint no-param-reassign: 0 */
export class RectsUtil {
  constructor(rects) {
    this._rects = rects;
    this._offsets = {
      left: 0,
      top: 0,
    };
  }

  toAbsolute() {
    this._rects.toAbsolute();
    return this;
  }

  translateX(offset) {
    this._offsets.left += offset;
    return this;
  }

  translateY(offset) {
    this._offsets.top += offset;
    return this;
  }

  build() {
    return this._rects.map((rect) => {
      rect.top += this._offsets.top;
      rect.left += this._offsets.left;
      return rect;
    });
  }
}
