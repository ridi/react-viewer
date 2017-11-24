import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition, movePageViewer } from '../../redux/viewerScreen/ViewerScreen.action';
import { setScrollTop } from '../BrowserWrapper';
import {
  selectViewerReadPosition,
  selectViewerScreenSettings,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { VIEWER_EMPTY_READ_POSITION, ViewerType } from '../../constants/ViewerScreenConstants';
import ReaderJsWrapper from '../ReaderJsWrapper';

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._reader = null;
  }

  _getScrollMode() {
    const state = this.store.getState();
    const viewerScreenSettings = selectViewerScreenSettings(state);
    return viewerScreenSettings.viewerType === ViewerType.SCROLL;
  }

  _getOffsetByNodeLocation(location) {
    if (isExist(this._reader)) {
      return this._reader.getOffsetFromNodeLocation(location);
    }
    return null;
  }

  setScreenElement(screen) {
    if (isExist(screen)) {
      this._reader = new ReaderJsWrapper(screen, this._getScrollMode());
      this.setDebugMode(this._debugMode);
    }
  }

  invalidateContext() {
    if (isExist(this._reader)) {
      this._reader.invalidateContext(this._getScrollMode());
    }
  }

  setDebugMode(debugMode = true) {
    this._debugMode = debugMode;
    if (isExist(this._reader)) {
      this._reader.setDebugMode(debugMode);
    }
  }

  getNodeLocation() {
    if (!isExist(this._reader)) {
      return VIEWER_EMPTY_READ_POSITION;
    }
    // nodeIndex#wordIndex (if couldn't find returns -1#-1)
    return this._reader.getNodeLocationOfCurrentPage();
  }

  unmountReader() {
    if (isExist(this._reader)) {
      this._reader.removeScrollListenerIfNeeded();
    }
  }

  restorePosition() {
    const { dispatch, getState } = this.store;
    const readPosition = selectViewerReadPosition(getState());

    const offset = this._getOffsetByNodeLocation(readPosition);
    if (isExist(offset)) {
      if (this._getScrollMode()) {
        setScrollTop(offset);
      } else {
        dispatch(movePageViewer(offset + 1));
      }
    }
  }

  updateChangedReadPosition() {
    const readPosition = this.getNodeLocation();
    const { dispatch, getState } = this.store;
    const originPosition = selectViewerReadPosition(getState());
    //  readPosition reducer에 저장
    if (isExist(readPosition) && readPosition !== VIEWER_EMPTY_READ_POSITION && readPosition !== originPosition) {
      dispatch(changedReadPosition(readPosition));
    }
  }
}

const readPositionHelper = new ReadPositionHelper();
export default readPositionHelper;
