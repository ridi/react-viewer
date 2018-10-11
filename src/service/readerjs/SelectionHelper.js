import ReaderJsHelper from './ReaderJsHelper';

class SelectionHelper {
  constructor() {
    this.isSelectMode = true;
  }

  isInSelectionMode() {
    return this.isInSelectionMode();
  }

  getSelectedRangeRects() {
    return ReaderJsHelper.sel.getSelectedRangeRects();
  }

  startSelectionMode(x, y, unit) {
    if (this.isSelectMode) {
      this.endSelectionMode();
    }
    if (ReaderJsHelper.sel.startSelectionMode(x, y, unit)) {
      this.isSelectMode = true;
      return this.getSelectedRangeRects();
    }
    return null;
  }

  endSelectionMode() {
    if (this.isSelectMode) {
      this.isSelectMode = false;
      return this.getSelectedRangeRects();
    }
    return null;
  }

  expandUpper(x, y, unit) {
    if (ReaderJsHelper.sel.expandUpperSelection(x, y, unit)) {
      return this.getSelectedRangeRects();
    }
    return null;
  }

  expandLower(x, y, unit) {
    if (ReaderJsHelper.sel.expandLowerSelection(x, y, unit)) {
      return this.getSelectedRangeRects();
    }
    return null;
  }
}

export default new SelectionHelper();
