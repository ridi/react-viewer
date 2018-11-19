import ReaderJsHelper from '../readerjs/ReaderJsHelper';
import Connector from './index';
import { DefaultSelectionStyle, SelectionMode } from '../../constants/SelectionConstants';
import { wordCount } from '../../util/Util';
import BaseConnector from './BaseConnector';
import { updateSelection } from '../../redux/action';
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

  _cacheSelection(selectionModeForced = SelectionMode.NORMAL) {
    const { contentIndex } = Connector.current.getCurrent();
    const text = ReaderJsHelper.getCurrent().sel.getText();
    const rects = ReaderJsHelper.getCurrent().sel.getRects();
    const serializedRange = ReaderJsHelper.getCurrent().sel.getRange().toSerializedString();

    let selectionMode = selectionModeForced;
    if (selectionMode === SelectionMode.NORMAL) {
      selectionMode = (wordCount(text) > 2 ? SelectionMode.AUTO_HIGHLIGHT : SelectionMode.USER_SELECTION);
    }
    this._selection = {
      serializedRange,
      rects: new RectsUtil(rects).toAbsolute().getObject(),
      text,
      withHandle: selectionMode === SelectionMode.USER_SELECTION,
      style: DefaultSelectionStyle[selectionMode],
      contentIndex,
    };
    this._selectionMode = selectionMode;
    this.dispatch(updateSelection(this._selection));
  }

  afterConnected() {
    this._init();
  }

  start(x, y) {
    this.end();
    if (ReaderJsHelper.getCurrent().sel.start(x, y)) {
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
      if (ReaderJsHelper.getCurrent().sel.expandIntoUpper(x, y)) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  expandIntoLower(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (ReaderJsHelper.getCurrent().sel.expandIntoLower(x, y)) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  getRectsFromSerializedRange(contentIndex, serializedRange) {
    let readerJs;
    try {
      readerJs = ReaderJsHelper.get(contentIndex);
      const rects = readerJs.getRectsFromSerializedRange(serializedRange);
      return new RectsUtil(rects).toAbsolute().getObject();
    } catch (e) {
      console.warn(e);
      return [];
    }
  }
}

export default new SelectionConnector();
