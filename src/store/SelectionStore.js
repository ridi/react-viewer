import BaseStore from './BaseStore';
import { DefaultSelectionStyle, SelectionMode } from '../constants';
import ReaderJsHelper from '../service/readerjs/ReaderJsHelper';
import { wordCount } from '../util/Util';
import { RectsUtil } from '../util/SelectionUtil';

class SelectionStore extends BaseStore {
  _isSelecting = false;
  _selection = null;
  _selectionMode = SelectionMode.NORMAL;
  _contentIndex = null;

  constructor() {
    super({ selection: null, selectionMode: SelectionMode.NORMAL });
    this._init();
  }

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
    this.next();
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
      rects: new RectsUtil(rects).toAbsolute().build(),
      text,
      withHandle: selectionMode === SelectionMode.USER_SELECTION,
      color: DefaultSelectionStyle[selectionMode],
      contentIndex: this._contentIndex,
      position: this._position,
    };
    this._selectionMode = selectionMode;
    this.next();
  }

  getData() {
    return {
      selection: this._selection,
      selectionMode: this._selectionMode,
    };
  }

  start(x, y, contentIndex, position) {
    this.end();

    this._contentIndex = contentIndex;
    this._position = position;
    if (this._getCurrentReaderJs().sel.start(x, y, '')) {
      this._isSelecting = true;
      this._cacheSelection();
      return true;
    }
    return false;
  }

  end() {
    this._init();
    return true;
  }

  expandIntoUpper(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (this._getCurrentReaderJs().sel.expandIntoUpper(x, y, '')) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }

  expandIntoLower(x, y, selectionModeForced) {
    if (this._isSelecting) {
      if (this._getCurrentReaderJs().sel.expandIntoLower(x, y, '')) {
        this._cacheSelection(selectionModeForced);
        return true;
      }
    }
    return false;
  }
}

export default new SelectionStore();
