import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from './Util';
import { screenHeight, screenWidth } from './BrowserWrapper';
import { VIEWER_EMPTY_READ_POSITION } from '../constants/ViewerScreenConstants';

const DETECTION_TYPE = 'up'; // bottom or up

export default class ReaderJsWrapper {
  constructor(screen, scrollMode) {
    this._screen = screen;
    this._context = this.createContext(scrollMode);
    this._reader = new Reader(this._screen, this._context);
  }

  createContext(scrollMode) {
    const columnGap = Util.getStylePropertyIntValue(this._screen, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, scrollMode);
  }

  invalidateContext(scrollMode) {
    this._context = this.createContext(scrollMode);
    this._reader.changeContext(this._context);
  }

  setDebugMode(debugMode = true) {
    this._isDebug = debugMode;
    this._reader.debugNodeLocation = this._isDebug;
  }

  getOffsetFromNodeLocation(location) {
    if (isExist(location) && location !== VIEWER_EMPTY_READ_POSITION) {
      return this._reader.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocationOfCurrentPage() {
    return this._reader.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }

  removeScrollListenerIfNeeded() {
    this._reader.removeScrollListenerIfNeeded();
  }
}
