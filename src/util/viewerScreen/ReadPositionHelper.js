import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition } from '../../redux/viewerScreen/ViewerScreen.action';
import App from '../../../modules/Reader.js/src/android/App';
import EPub from '../../../modules/Reader.js/src/android/EPub';
import { screenHeight, screenWidth } from '../BrowserWrapper';
import { selectViewerReadPosition, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import { ViewerType } from '../../constants/ViewerScreenConstants';

const EMPTY_POSITION = '-1#-1';
const DETECTION_TYPE = 'bottom'; // bottom or up

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._screen = null;
    this._calculateTimer = null;
    this._epub = null;
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
      window.app = new App(width, height, false, scrollMode, 0, this._screen);

      this._epub = EPub;
      this._epub.setTextAndImageNodes(this._screen);
      this.setDebugMode();
    }
  }

  setDebugMode(debugMode = this._isDebug) {
    this._isDebug = debugMode;
    if (isExist(this._epub)) {
      this._epub.setDebugNodeLocation(this._isDebug);
    }
  }

  getOffsetByNodeLocation(location) {
    if (isExist(this._epub)) {
      return this._epub.getOffsetFromNodeLocation(location);
    }
    return null;
  }

  getNodeLocation() {
    if (!isExist(this._epub)) {
      return EMPTY_POSITION;
    }
    // nodeIndex#wordIndex (if couldn't find returns -1#-1)
    return this._epub.getNodeLocationOfCurrentPage(DETECTION_TYPE);
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
