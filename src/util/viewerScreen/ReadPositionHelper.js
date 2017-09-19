import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition } from '../../redux/viewerScreen/ViewerScreen.action';
import App from '../../../modules/Reader.js/src/android/App';
import EPub from '../../../modules/Reader.js/src/android/EPub';
import { screenHeight, screenWidth } from '../BrowserWrapper';
import { selectViewerReadPosition, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import ViewerType from '../../constants/DOMEventConstants';

const EMPTY_POSITION = '-1#-1';
const DETECTION_TYPE = 'bottom'; // bottom or up
const isDebug = true;

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._screen = null;
    this._calculateTimer = null;
    this._epub = null;
  }

  setScreenElement(screen) {
    if (isExist(screen)) {
      const state = this.store.getState();
      const viewerScreenSettings = selectViewerScreenSettings(state);

      this._screen = screen;
      const width = screenWidth();
      const height = screenHeight();
      const scrollMode = (viewerScreenSettings.viewerType === ViewerType.SCROLL);

      // FIXME Do not use directly window, document
      window.app = new App(width, height, false, scrollMode);

      this._epub = EPub;
      this._epub.setTextAndImageNodes(this._screen);
      this._epub.setDebugNodeLocation(isDebug);
      // `getNodeLocationOfCurrentPage` 불릴 때 찾은 위치를 표시해줌
    }
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
