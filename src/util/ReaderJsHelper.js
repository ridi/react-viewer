import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from './Util';
import { screenHeight, screenWidth } from './BrowserWrapper';
import { EMPTY_READ_LOCATION } from '../constants/SettingConstants';

const DETECTION_TYPE = 'top'; // bottom or top

export default class ReaderJsHelper {
  constructor(node, isScrollMode) {
    this.node = node;
    this.readerJs = new Reader(this.node, this._createContext(isScrollMode));
    this.setDebugMode(process.env.NODE_ENV === 'development');
  }

  unmount() {
    this.readerJs.unmount();
  }

  _createContext(isScrollMode) {
    const columnGap = Util.getStylePropertyIntValue(this.node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode);
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
