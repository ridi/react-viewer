
export class RectsUtil {
  constructor(rects) {
    this.rects = rects;
    this.offsets = {
      left: 0,
      top: 0,
    };
  }

  translateX(offset) {
    this.offsets.left += offset;
    return this;
  }

  translateY(offset) {
    this.offsets.top += offset;
    return this;
  }

  getRects() {
    return this.rects.map(rect => ({
      ...rect,
      top: rect.top + this.offsets.top,
      left: rect.left + this.offsets.left,
    }));
  }
}
