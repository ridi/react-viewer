import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from '../../util/Util';
import { screenHeight, screenWidth } from '../../util/BrowserWrapper';
import { EMPTY_READ_LOCATION } from '../../constants/SettingConstants';

const DETECTION_TYPE = 'top'; // bottom or top

class ReaderJsHelper {
  constructor() {
    this._readerJs = null;
    this._isMounted = false;
    this._node = null;
  }

  get isMounted() {
    return this._isMounted;
  }

  get readerJs() {
    if (!this._isMounted) {
      throw new Error('Readerjs is not initialized. Use `ReaderJsHelper.mount()`.');
    }
    return this._readerJs;
  }

  set readerJs(readerJs) {
    this._readerJs = readerJs;
  }

  get sel() {
    return this.readerJs.sel;
  }

  get content() {
    return this.readerJs.content;
  }

  get node() {
    if (!this._isMounted) {
      throw new Error('Readerjs is not initialized. Use `ReaderJsHelper.mount()`.');
    }
    return this._node;
  }

  mount(node, isScrollMode) {
    this.readerJs = new Reader(node, this._createContext(node, isScrollMode));
    this._node = node;
    this._isMounted = true;
    this.setDebugMode(process.env.NODE_ENV === 'development');
  }

  unmount() {
    try {
      this.readerJs.unmount();
    } catch (e) {
      /* ignore */
    }
    this.readerJs = null;
    this._node = null;
    this._isMounted = false;
  }

  // TODO maxSelectionLength as configuration
  _createContext(node, isScrollMode, maxSelectionLength = 1000) {
    const columnGap = Util.getStylePropertyIntValue(node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode, maxSelectionLength);
  }

  invalidateContext(isScrollMode) {
    this.readerJs.changeContext(this._createContext(isScrollMode));
  }

  setDebugMode(debugMode = false) {
    this.readerJs.debugNodeLocation = debugMode;
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
}

export default new ReaderJsHelper();
