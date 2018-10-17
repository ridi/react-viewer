import ReaderJsHelper from './ReaderJsHelper';

class SelectionHelper {
  constructor() {
    this.isSelectMode = false;
  }

  isInSelectionMode() {
    return this.isSelectMode;
  }

  startSelectionMode(x, y, unit) {
    console.log(this.isSelectMode);
    this.endSelectionMode();
    this.isSelectMode = true;
    return ReaderJsHelper.sel.startSelectionMode(x, y, unit);
  }

  endSelectionMode(x, y, unit) {
    if (this.isSelectMode) {
      const rects = this.expandLower(x, y, unit);
      this.isSelectMode = false;
      return rects;
    }
    return [];
  }

  expandUpper(x, y, unit) {
    return ReaderJsHelper.sel.expandUpperSelection(x, y, unit);
  }

  expandLower(x, y, unit) {
    return ReaderJsHelper.sel.expandLowerSelection(x, y, unit);
  }

  getSelectionInfo() {
    return {
      serializedRange: ReaderJsHelper.sel.getSelectedSerializedRange(),
      rects: ReaderJsHelper.sel.getSelectedRangeRects(),
      text: ReaderJsHelper.sel.getSelectedText(),
    };
  }
}

export default new SelectionHelper();
