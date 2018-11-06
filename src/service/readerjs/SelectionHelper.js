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
    if (ReaderJsHelper.sel.start(x, y)) {
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
    return ReaderJsHelper.sel.expandIntoUpper(x, y);
  }

  expandLower(x, y) {
    return ReaderJsHelper.sel.expandIntoLower(x, y);
  }

  getSelectionInfo() {
    return {
      serializedRange: ReaderJsHelper.sel.getRange().toSerializedString(),
      rects: ReaderJsHelper.sel.getRects(),
      text: ReaderJsHelper.sel.getText(),
    };
  }
}

export default new SelectionHelper();
