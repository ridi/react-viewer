import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from './Util';
import { screenHeight, screenWidth } from './BrowserWrapper';
import { EMPTY_READ_POSITION } from '../constants/SettingConstants';

const DETECTION_TYPE = 'top'; // bottom or top

export default class ReaderJsHelper {
  constructor(node, isScrollMode) {
    this._node = node;
    this._context = this._createContext(isScrollMode);
    this._readerJs = new Reader(this._node, this._context);
    if (process.env.NODE_ENV === 'development') {
      this.setDebugMode(true);
    }
  }

  _createContext(isScrollMode) {
    const columnGap = Util.getStylePropertyIntValue(this._node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode);
  }

  invalidateContext(isScrollMode) {
    this._context = this._createContext(isScrollMode);
    this._readerJs.changeContext(this._context);
  }

  setDebugMode(debugMode = false) {
    this._readerJs.debugNodeLocation = debugMode;
  }

  getOffsetFromNodeLocation(location) {
    if (isExist(location) && location !== EMPTY_READ_POSITION) {
      return this._readerJs.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocationOfCurrentPage() {
    return this._readerJs.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }
}
