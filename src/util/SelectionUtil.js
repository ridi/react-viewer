
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

  getObject() {
    return this._rects.map(rect => ({
      width: rect.width,
      height: rect.height,
      top: rect.top + this._offsets.top,
      left: rect.left + this._offsets.left,
    }));
  }
}
