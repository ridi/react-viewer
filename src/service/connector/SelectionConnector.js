import ReaderJsHelper from '../readerjs/ReaderJsHelper';
import Connector from './index';
import { DefaultSelectionStyle, SelectionMode } from '../../constants/SelectionConstants';
import { wordCount } from '../../util/Util';
import BaseConnector from './BaseConnector';
import { updateSelection } from '../../redux/action';
import { SELECTION_LAYER_EXPANDED_WIDTH } from '../../constants/StyledConstants';
import { ViewType } from '../..';

class SelectionConnector extends BaseConnector {
  afterConnected() {
    this.init();
  }

  init() {
    this.isSelecting = false;
  }

  isAvailable() {
    return ReaderJsHelper.isMounted;
  }

  isSelectMode() {
    return this.isSelecting;
  }

  saveSelection() {
    const { contentIndex } = Connector.current.getCurrent();
    const text = ReaderJsHelper.sel.getText();
    const rects = ReaderJsHelper.sel.getRects().toAbsolute(ReaderJsHelper.node);
    const serializedRange = ReaderJsHelper.sel.getRange().toSerializedString();

    const selectionMode = (wordCount(text) > 2 ? SelectionMode.AUTO_HIGHLIGHT : SelectionMode.USER_SELECTION);
    this.dispatch(updateSelection(
      {
        serializedRange,
        rects: this.getContentRelativeRects(rects),
        text,
        withHandle: selectionMode === SelectionMode.USER_SELECTION,
        style: DefaultSelectionStyle[selectionMode],
        contentIndex,
      },
      selectionMode,
    ));
  }

  clearSelection() {
    this.dispatch(updateSelection(null, SelectionMode.NORMAL));
  }

  startSelection(x, y) {
    this.endSelection();
    if (ReaderJsHelper.sel.start(x, y)) {
      this.isSelecting = true;
      this.saveSelection();
    }
  }

  endSelection(x, y) {
    if (this.isSelecting) {
      this.expandLower(x, y);
      this.isSelecting = false;
      return true;
    }
    return false;
  }

  expandUpper(x, y) {
    if (this.isSelecting) {
      if (ReaderJsHelper.sel.expandIntoUpper(x, y)) {
        this.saveSelection();
        return true;
      }
    }
    return false;
  }

  expandLower(x, y) {
    if (this.isSelecting) {
      if (ReaderJsHelper.sel.expandIntoLower(x, y)) {
        this.saveSelection();
        return true;
      }
    }
    return false;
  }

  getContentRelativeRects(rects) {
    const { viewType } = Connector.setting.getSetting();
    return rects.map(({
      top,
      left,
      width,
      height,
    }) => ({
      top: (viewType === ViewType.SCROLL ? top : top - Connector.setting.getContainerVerticalMargin()) + SELECTION_LAYER_EXPANDED_WIDTH,
      left: (viewType === ViewType.SCROLL ? left - Connector.setting.getContainerHorizontalMargin() : left) + SELECTION_LAYER_EXPANDED_WIDTH,
      width,
      height,
    }));
  }

  getRectsFromSerializedRange(serializedRange) {
    try {
      const absoluteRects = ReaderJsHelper.readerJs.getRectsFromSerializedRange(serializedRange).toAbsolute(ReaderJsHelper.node);
      console.log(serializedRange, '=>', absoluteRects, ReaderJsHelper.readerJs.context, ReaderJsHelper.node);
      return this.getContentRelativeRects(absoluteRects);
    } catch (e) {
      console.warn(e);
      return [];
    }
  }
}

export default new SelectionConnector();
