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
    const viewerScreenSettings = selectViewerScreenSettings(this.getState());
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
      if (isExist(this._reader)) {
        this._reader.unmount();
      }
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

  restorePosition() {
    const readPosition = selectViewerReadPosition(this.getState());

    const offset = this._getOffsetByNodeLocation(readPosition);
    if (isExist(offset)) {
      if (this._getScrollMode()) {
        setScrollTop(offset);
      } else {
        this.dispatch(movePageViewer(offset + 1));
      }
    }
  }

  updateChangedReadPosition() {
    const readPosition = this.getNodeLocation();
    const originPosition = selectViewerReadPosition(this.getState());
    //  readPosition reducer에 저장
    if (isExist(readPosition) && readPosition !== VIEWER_EMPTY_READ_POSITION && readPosition !== originPosition) {
      this.dispatch(changedReadPosition(readPosition));
    }
  }
}

const readPositionHelper = new ReadPositionHelper();
export default readPositionHelper;
