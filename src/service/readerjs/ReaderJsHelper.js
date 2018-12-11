import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from '../../util/Util';
import { screenHeight, screenWidth } from '../../util/BrowserWrapper';
import {
  CONTENT_WRAPPER,
  EMPTY_READ_LOCATION,
  ViewType,
} from '../../constants/SettingConstants';
import Connector from '../connector';
import SettingConnector from '../connector/SettingConnector';

const DETECTION_TYPE = 'top'; // bottom or top

class ReaderJsWrapper {
  _readerJs = null;
  _node = null;
  _contentIndex = null;

  constructor(contentIndex) {
    if (!isExist(contentIndex)) {
      throw new Error('ReaderJs initialization needs `contentIndex`.');
    }
    this._contentIndex = contentIndex;
  }

  get readerJs() {
    if (this._isValid()) {
      return this._readerJs;
    }

    const { viewType } = Connector.setting.getSetting();
    const node = this._getContentNode();
    if (node) {
      this._mount(node, viewType === ViewType.SCROLL);
    }
    if (!this._readerJs) {
      throw new Error('ReaderJs was not able to initialized.');
    }
    return this._readerJs;
  }

  get sel() {
    return this.readerJs.sel;
  }

  get content() {
    return this.readerJs.content;
  }

  get context() {
    return this.readerJs.context;
  }

  _getContentNode() {
    return document.querySelector(`#${SettingConnector.getChapterId(this._contentIndex)} ${CONTENT_WRAPPER}`);
  }

  _isValid() {
    const { viewType } = Connector.setting.getSetting();
    if (this._readerJs) {
      return ((viewType === ViewType.SCROLL) === this._readerJs.context.isScrollMode)
        && this._node
        && this._node.isConnected
        && this._node === this._getContentNode();
    }
    return false;
  }

  _mount(node, isScrollMode) {
    if (this._readerJs) {
      this._unmount();
    }
    this._readerJs = new Reader(node, this._createContext(node, isScrollMode));
    this._node = node;
    this._setDebugMode(process.env.NODE_ENV === 'development');
  }

  _unmount() {
    try {
      this._readerJs.unmount();
    } catch (e) {
      /* ignore */
    }
    this._readerJs = null;
    this._node = null;
  }

  // TODO maxSelectionLength as configuration
  _createContext(node, isScrollMode, maxSelectionLength = 1000) {
    const columnGap = Util.getStylePropertyIntValue(node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode, maxSelectionLength);
  }

  _setDebugMode(debugMode = false) {
    this._readerJs.debugNodeLocation = debugMode;
  }

  getOffsetFromNodeLocation(location) {
    if (isExist(location) && location !== EMPTY_READ_LOCATION) {
      return this.readerJs.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocationOfCurrentPage() {
    return this.readerJs.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }

  getRectsFromSerializedRange(serializedRange) {
    return this.readerJs.getRectsFromSerializedRange(serializedRange);
  }
}

export default class ReaderJsHelper {
  static _readerJs = {}; // [content_index] : [ReaderJsWrapper instance]

  static get(contentIndex) {
    if (!this._readerJs[contentIndex]) {
      this._readerJs[contentIndex] = new ReaderJsWrapper(contentIndex);
    }
    return this._readerJs[contentIndex];
  }

  static getCurrent() {
    const { contentIndex } = Connector.current.getCurrent();
    return ReaderJsHelper.get(contentIndex);
  }

  static getCurrentFromCoord(x, y) {
    // TODO implement
  }

  static getCurrentFromTouchEvent(event) {
    // TODO implement
  }
}
