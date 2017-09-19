import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition } from '../../redux/viewerScreen/ViewerScreen.action';
import Reader from '../../../modules/Reader.js/src/android/Reader';
import { screenHeight, screenWidth } from '../BrowserWrapper';
import { selectViewerReadPosition, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import { ViewerType } from '../../constants/ViewerScreenConstants';
import Context from '../../../modules/Reader.js/src/android/Context';
import Util from '../../../modules/Reader.js/src/android/Util';

const EMPTY_POSITION = '-1#-1';
const DETECTION_TYPE = 'bottom'; // bottom or up

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._screen = null;
    this._calculateTimer = null;
    this._reader = null;
    this._context = null;
    this._isDebug = false;
  }

  setScreenElement(screen) {
    if (isExist(screen)) {
      console.log('setScreenElement', screen);
      const state = this.store.getState();
      const viewerScreenSettings = selectViewerScreenSettings(state);

      this._screen = screen;
      const width = screenWidth();
      const height = screenHeight();
      const scrollMode = (viewerScreenSettings.viewerType === ViewerType.SCROLL);

      // FIXME Do not use directly window, document
      const columnGap = Util.getStylePropertyIntValue(this._screen, 'column-gap');
      this._context = new Context(width, height, columnGap, false, scrollMode);
      this._reader = new Reader(this._screen, this._context, 0);
      this.setDebugMode();
    }
  }

  setDebugMode(debugMode = this._isDebug) {
    this._isDebug = debugMode;
    if (isExist(this._reader)) {
      this._reader.debugNodeLocation = this._isDebug;
    }
  }

  getOffsetByNodeLocation(location) {
    if (isExist(this._reader)) {
      return this._reader.getOffsetFromNodeLocation(location);
    }
    return null;
  }

  getNodeLocation() {
    if (!isExist(this._reader)) {
      return EMPTY_POSITION;
    }
    // nodeIndex#wordIndex (if couldn't find returns -1#-1)
    return this._reader.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }

  dispatchChangedReadPosition() {
    const { dispatch, getState } = this.store;
    const readPosition = this.getNodeLocation();
    const originPosition = selectViewerReadPosition(getState());
    //  readPosition reducer에 저장
    if (readPosition !== EMPTY_POSITION && readPosition !== originPosition) {
      dispatch(changedReadPosition(readPosition));
    }
  }
}

const readPositionHelper = new ReadPositionHelper();
export default readPositionHelper;
