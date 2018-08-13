import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from './Util';
import { screenHeight, screenWidth } from './BrowserWrapper';
import { EMPTY_READ_LOCATION } from '../constants/SettingConstants';

const DETECTION_TYPE = 'top'; // bottom or top

export default class ReaderJsHelper {
  constructor(node, isScrollMode) {
    this._node = node;
    this._context = this._createContext(isScrollMode);
    this._readerJs = new Reader(this._node, this._context);
    this.setDebugMode(process.env.NODE_ENV === 'development');
  }

  unmount() {
    if (!this._readerJs) return;
    this._readerJs.unmount();
  }

  _createContext(isScrollMode) {
    const columnGap = Util.getStylePropertyIntValue(this._node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode);
  }

  invalidateContext(isScrollMode) {
    if (!this._readerJs) return;
    this._context = this._createContext(isScrollMode);
    this._readerJs.changeContext(this._context);
  }

  setDebugMode(debugMode = false) {
    if (!this._readerJs) return;
    this._readerJs.debugNodeLocation = debugMode;
  }

  getOffsetFromNodeLocation(location) {
    if (!this._readerJs) return null;
    if (isExist(location) && location !== EMPTY_READ_LOCATION) {
      return this._readerJs.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocationOfCurrentPage() {
    if (!this._readerJs) return null;
    return this._readerJs.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }
}
