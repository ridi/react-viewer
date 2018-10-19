import ReaderJsHelper from './ReaderJsHelper';

class SelectionHelper {
  constructor() {
    this.isSelectMode = false;
  }

  isInSelectionMode() {
    return this.isSelectMode;
  }

  startSelectionMode(x, y) {
    this.endSelectionMode();
    if (ReaderJsHelper.sel.startSelectionMode(x, y)) {
      this.isSelectMode = true;
    }
  }

  endSelectionMode(x, y) {
    if (this.isSelectMode) {
      const expanded = this.expandLower(x, y);
      this.isSelectMode = false;
      return expanded;
    }
    return false;
  }

  expandUpper(x, y) {
    return ReaderJsHelper.sel.expandUpperSelection(x, y);
  }

  expandLower(x, y) {
    return ReaderJsHelper.sel.expandLowerSelection(x, y);
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
