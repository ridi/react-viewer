import { Context, Reader, Util } from '@ridi/reader.js/web';
import { isExist } from '../../util/Util';
import { screenHeight, screenWidth } from '../../util/BrowserWrapper';
import { EMPTY_READ_LOCATION, READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import Connector from '../connector';
import { RectsUtil } from '../../util/SelectionUtil';

const DETECTION_TYPE = 'top'; // bottom or top

const getCurrentContentNode = () => document.querySelector(`.${READERJS_CONTENT_WRAPPER}`);

class ReaderJsHelper {
  _readerJs = null;
  _node = null;

  get readerJs() {
    if (this._isValid()) {
      return this._readerJs;
    }

    const { viewType } = Connector.setting.getSetting();
    const node = getCurrentContentNode();
    if (node) {
      this._mount(node, viewType === ViewType.SCROLL);
    }
    if (!this._readerJs) {
      throw new Error('Readerjs was not able to initialized.');
    }
    console.log(this._node, this._readerJs.context.isScrollMode);
    return this._readerJs;
  }

  get sel() {
    return this.readerJs.sel;
  }

  get content() {
    return this.readerJs.content;
  }

  _isValid() {
    const { viewType } = Connector.setting.getSetting();
    if (this._readerJs) {
      return ((viewType === ViewType.SCROLL) === this._readerJs.context.isScrollMode)
        && this._node
        && this._node.isConnected
        && this._node === getCurrentContentNode();
    }
    return false;
  }

  _mount(node, isScrollMode) {
    if (this._readerJs) {
      this._unmount();
    }
    this._readerJs = new Reader(node, this._createContext(node, isScrollMode));
    this._node = node;
    this._setDebugMode(process.env.NODE_ENV === 'development');
  }

  _unmount() {
    try {
      this._readerJs.unmount();
    } catch (e) {
      /* ignore */
    }
    this._readerJs = null;
    this._node = null;
  }

  // TODO maxSelectionLength as configuration
  _createContext(node, isScrollMode, maxSelectionLength = 1000) {
    const columnGap = Util.getStylePropertyIntValue(node, 'column-gap');
    const width = screenWidth() - columnGap;
    const height = screenHeight();
    return new Context(width, height, columnGap, false, isScrollMode, maxSelectionLength);
  }

  _setDebugMode(debugMode = false) {
    this._readerJs.debugNodeLocation = debugMode;
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

  getContentRelativeRects(rects) {
    const { viewType } = Connector.setting.getSetting();
    const isScroll = viewType === ViewType.SCROLL;

    // todo check result value
    const result = new RectsUtil(rects.toAbsolute(this.content.wrapper))
      .translateX(isScroll ? 0 : Connector.setting.getContainerHorizontalMargin() * 2)
      // .translateY(isScroll ? Connector.setting.getContainerVerticalMargin() + (Connector.setting.getScrollingContentGap() / 2) : 0)
      .translateY(isScroll ? this.content.wrapper.parentNode.offsetTop + (Connector.setting.getScrollingContentGap() / 2) : 0)
      .getRects();
    // console.log(this.content.wrapper, this.content.wrapper.isConnected, isScroll, rects, result);
    return result;
  }
}

export default new ReaderJsHelper();
