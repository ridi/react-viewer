import ReaderJsHelper from '../readerjs/ReaderJsHelper';
import { DefaultSelectionStyle, SelectionMode } from '../../constants/SelectionConstants';
import { wordCount } from '../../util/Util';
import BaseConnector from './BaseConnector';
import { updateSelection } from '../../redux/action';
import { RectsUtil } from '../../util/SelectionUtil';
import Logger from '../../util/Logger';

class SelectionConnector extends BaseConnector {
  _isSelecting = false;
  _selection = null;
  _selectionMode = SelectionMode.NORMAL;
  _contentIndex = null;

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
    this._contentIndex = null;
    this._position = null;
  }

  _getCurrentReaderJs() {
    return ReaderJsHelper.get(this._contentIndex);
  }

  _cacheSelection(selectionModeForced = SelectionMode.NORMAL) {
    const readerJs = this._getCurrentReaderJs();
    const text = readerJs.sel.getText();
    const rects = readerJs.sel.getRects();
    const serializedRange = readerJs.sel.getRange().toSerializedString();

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
      contentIndex: this._contentIndex,
      position: this._position,
    };
    this._selectionMode = selectionMode;
    this.dispatch(updateSelection(this._selection));
  }

  afterConnected() {
    this._init();
  }

  start(x, y, contentIndex, position) {
    this.end();

    this._contentIndex = contentIndex;
    this._position = position;
    if (this._getCurrentReaderJs().sel.start(x, y)) {
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
      if (this._getCurrentReaderJs().sel.expandIntoUpper(x, y)) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  expandIntoLower(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (this._getCurrentReaderJs().sel.expandIntoLower(x, y)) {
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
      Logger.warn(e);
      return [];
    }
  }
}

export default new SelectionConnector();
