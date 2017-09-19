import Connector from '../Connector';
import { isExist } from '../Util';
import { changedReadPosition } from '../../redux/viewerScreen/ViewerScreen.action';
import App from '../../../modules/Reader.js/src/android/App';
import EPub from '../../../modules/Reader.js/src/android/EPub';
import { screenHeight, screenWidth } from '../BrowserWrapper';

class ReadPositionHelper extends Connector {
  constructor() {
    super();
    this._screen = null;
    this._calculateTimer = null;
    this._epub = null;
  }

  setScreenElement(screen) {
    if (isExist(screen)) {
      this._screen = screen;
      const width = screenWidth();
      const height = screenHeight();
      // fixme check
      const scrollMode = false; // (viewerScreenSettings.viewerType === ViewerType.SCROLL);

      // FIXME Do not use directly window, document
      window.app = new App(width, height, false, scrollMode, 0);

      this._epub = EPub;
      this._epub.setTextAndImageNodes(this._screen);
      this._epub.setDebugNodeLocation(true); // `getNodeLocationOfCurrentPage` 불릴 때 찾은 위치를 표시해줌
    }
  }


  getNodeLocation() {
    return this.epub.getNodeLocationOfCurrentPage('bottom'); // nodeIndex#wordIndex (못 찾을 경우 -1#-1)
  }

  dispatchReadPosition() {
    const { getState, dispatch } = this.store;
    const readPosition = this.getNodeLocation();
    //  readPosition reducer에 저장
    if (readPosition !== '-1#-1') {
      dispatch(changedReadPosition(readPosition));
    }
  }
}

const readPositionHelper = new ReadPositionHelper();
export default readPositionHelper;
