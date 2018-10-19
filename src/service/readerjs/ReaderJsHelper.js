import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from '../../util/Util';
import { screenHeight, screenWidth } from '../../util/BrowserWrapper';
import { EMPTY_READ_LOCATION } from '../../constants/SettingConstants';

const DETECTION_TYPE = 'top'; // bottom or top

class ReaderJsHelper {
  constructor() {
    this._readerJs = null;
    this.node = null;
  }

  get readerJs() {
    if (this._readerJs === null) {
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

  mount(node, isScrollMode) {
    this.node = node;
    this.readerJs = new Reader(this.node, this._createContext(isScrollMode));
    this.setDebugMode(process.env.NODE_ENV === 'development');
  }

  unmount() {
    try {
      this.readerJs.unmount();
    } catch (e) {
      /* ignore */
    }
    this.readerJs = null;
    this.node = null;
  }

  // TODO maxSelectionLength as configuration
  _createContext(isScrollMode, maxSelectionLength = 1000) {
    const columnGap = Util.getStylePropertyIntValue(this.node, 'column-gap');
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
