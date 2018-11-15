import ReaderJsHelper from '../readerjs/ReaderJsHelper';
import Connector from './index';
import { DefaultSelectionStyle, SelectionMode } from '../../constants/SelectionConstants';
import { wordCount } from '../../util/Util';
import BaseConnector from './BaseConnector';
import { updateSelection } from '../../redux/action';
import { SELECTION_LAYER_EXPANDED_WIDTH } from '../../constants/StyledConstants';
import { ViewType } from '../..';
import { RectsUtil } from '../../util/SelectionUtil';

class SelectionConnector extends BaseConnector {
  _isSelecting = false;
  _selection = null;
  _selectionMode = SelectionMode.NORMAL;

  get isSelecting() {
    return this._isSelecting;
  }

  get selection() {
    return this._selection;
  }

  get selectionMode() {
    return this._selectionMode;
  }

  _init() {
    this._isSelecting = false;
    this._selection = null;
    this._selectionMode = SelectionMode.NORMAL;
  }

  _getContentRelativeRects(rects) {
    const { viewType } = Connector.setting.getSetting();
    const isScroll = viewType === ViewType.SCROLL;

    const result = new RectsUtil(rects.toAbsolute(ReaderJsHelper.node))
      .translateX(SELECTION_LAYER_EXPANDED_WIDTH)
      .translateY(SELECTION_LAYER_EXPANDED_WIDTH)
      .translateX(isScroll ? 0 : ReaderJsHelper.node.parentNode.scrollLeft)
      .translateX(isScroll ? -Connector.setting.getContainerHorizontalMargin() : 0)
      .translateY(isScroll ? 0 : -Connector.setting.getContainerVerticalMargin())
      .getRects();
    console.log(ReaderJsHelper.node, ReaderJsHelper.node.isConnected, isScroll, rects, result);
    return result;
  }

  _cacheSelection(selectionModeForced = SelectionMode.NORMAL) {
    const { contentIndex } = Connector.current.getCurrent();
    const text = ReaderJsHelper.sel.getText();
    const rects = ReaderJsHelper.sel.getRects();
    const serializedRange = ReaderJsHelper.sel.getRange().toSerializedString();

    let selectionMode = selectionModeForced;
    if (selectionMode === SelectionMode.NORMAL) {
      selectionMode = (wordCount(text) > 2 ? SelectionMode.AUTO_HIGHLIGHT : SelectionMode.USER_SELECTION);
    }
    this._selection = {
      serializedRange,
      rects: this._getContentRelativeRects(rects),
      text,
      withHandle: selectionMode === SelectionMode.USER_SELECTION,
      style: DefaultSelectionStyle[selectionMode],
      contentIndex,
    };
    this._selectionMode = selectionMode;
    console.log(this._selection, this._selectionMode);
    this.dispatch(updateSelection(this._selection));
  }

  afterConnected() {
    this._init();
  }

  start(x, y) {
    this.end();
    if (ReaderJsHelper.sel.start(x, y)) {
      this._isSelecting = true;
      this._cacheSelection();
      return true;
    }
    return false;
  }

  end() {
    this._init();
    this.dispatch(updateSelection(this._selection));
    return true;
  }

  expandIntoUpper(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (ReaderJsHelper.sel.expandIntoUpper(x, y)) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  expandIntoLower(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (ReaderJsHelper.sel.expandIntoLower(x, y)) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  getRectsFromSerializedRange(serializedRange) {
    try {
      const rects = ReaderJsHelper.readerJs.getRectsFromSerializedRange(serializedRange);
      return this._getContentRelativeRects(rects);
    } catch (e) {
      console.warn(e);
      return [];
    }
  }
}

export default new SelectionConnector();
