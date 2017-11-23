import { Context, Reader, Util } from '@ridi/reader.js/web';
import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition } from '../../redux/viewerScreen/ViewerScreen.action';
import { screenHeight, screenWidth } from '../BrowserWrapper';
import {
  selectViewerReadPosition,
  selectViewerScreenSettings,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { VIEWER_EMPTY_READ_POSITION, ViewerType } from '../../constants/ViewerScreenConstants';

const DETECTION_TYPE = 'up'; // bottom or up

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._screen = null;
    this._reader = null;
    this._context = null;
    this._isDebug = false;
  }

  setScreenElement(screen) {
    if (isExist(screen)) {
      this._screen = screen;
      this._context = this.createContext();
      this._reader = new Reader(this._screen, this._context, 0);
      this.setDebugMode();
    }
  }

  updateScreenElement(screen) {
    if (isExist(this._reader)) {
      this._reader.content.updateNodes(screen);
    }
  }

  createContext() {
    if (isExist(this._screen)) {
      const state = this.store.getState();
      const viewerScreenSettings = selectViewerScreenSettings(state);
      const columnGap = Util.getStylePropertyIntValue(this._screen, 'column-gap');
      const width = screenWidth() - columnGap;
      const height = screenHeight();
      const scrollMode = (viewerScreenSettings.viewerType === ViewerType.SCROLL);
      return new Context(width, height, columnGap, false, scrollMode);
    }
    return null;
  }

  invalidateContext() {
    if (isExist(this._reader)) {
      this._context = this.createContext();
      this._reader.changeContext(this._context);
    }
  }

  setDebugMode(debugMode = this._isDebug) {
    this._isDebug = debugMode;
    if (isExist(this._reader)) {
      this._reader.debugNodeLocation = this._isDebug;
    }
  }

  getOffsetByNodeLocation(location) {
    if (isExist(this._reader) && isExist(location) && location !== VIEWER_EMPTY_READ_POSITION) {
      return this._reader.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocation() {
    if (!isExist(this._reader)) {
      return VIEWER_EMPTY_READ_POSITION;
    }
    // nodeIndex#wordIndex (if couldn't find returns -1#-1)
    return this._reader.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }

  unmountReader() {
    if (isExist(this._reader)) {
      this._reader.removeScrollListenerIfNeeded();
    }
  }

  dispatchChangedReadPosition(nodeLocation = this.getNodeLocation()) {
    const { dispatch, getState } = this.store;
    const readPosition = nodeLocation;
    const originPosition = selectViewerReadPosition(getState());
    //  readPosition reducer에 저장
    if (isExist(readPosition) && readPosition !== VIEWER_EMPTY_READ_POSITION && readPosition !== originPosition) {
      dispatch(changedReadPosition(readPosition));
    }
  }
}

const readPositionHelper = new ReadPositionHelper();
export default readPositionHelper;
