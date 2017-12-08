import Connector from '../Connector';
import { selectPageViewPagination } from '../../redux/viewerScreen/ViewerScreen.selector';
import { documentClientWidth, documentClientHeight } from '../BrowserWrapper';
import {
  DEFAULT_PADDING_VERTICAL,
  MAX_PADDING_LEVEL,
  PAGE_MAX_WIDTH,
  PAGE_VIEWER_SELECTOR,
} from '../../constants/StyledConstants';
import { ContentType } from '../../constants/ContentConstants';
import { ViewerType } from '../../constants/ViewerScreenConstants';

class ViewerHelper extends Connector {
  afterConnected() {
    const {
      paddingVertical = DEFAULT_PADDING_VERTICAL,
      pageMaxWidth = PAGE_MAX_WIDTH,
      pageViewerSelector = PAGE_VIEWER_SELECTOR,
    } = this._options;

    this._targetSelector = pageViewerSelector;
    this._paddingVertical = paddingVertical;
    this._pageMaxWidth = pageMaxWidth;
  }

  getScrollStyle() {
    return {
      paddingTop: this._paddingVertical,
    };
  }

  getPageStyle(paddingLevel) {
    const { getState } = this.store;
    const width = documentClientWidth();
    const height = documentClientHeight();
    const pageView = selectPageViewPagination(getState());

    const { currentPage } = pageView;

    const maxGap = width > this._pageMaxWidth ? ((width - this._pageMaxWidth) / 2) : 0;
    const paddingHorizontal = Math.floor(width * 0.01 * (MAX_PADDING_LEVEL - paddingLevel));
    const columnGap = (paddingHorizontal + maxGap) * 2;

    return {
      WebkitColumnWidth: `${width}px`,
      columnWidth: `${width}px`,
      WebkitColumnGap: columnGap,
      columnGap,
      paddingTop: this._paddingVertical,
      paddingBottom: this._paddingVertical,
      paddingLeft: paddingHorizontal,
      paddingRight: paddingHorizontal,
      boxSizing: 'border-box',
      height,
      WebkitTransform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      transform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
    };
  }

  getComicPageStyle() {
    const { getState } = this.store;
    const width = documentClientWidth();
    const height = documentClientHeight();
    const pageView = selectPageViewPagination(getState());

    const { currentPage } = pageView;

    return {
      WebkitColumnWidth: `${width}px`,
      columnWidth: `${width}px`,
      WebkitColumnGap: 0,
      columnGap: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      height,
      WebkitTransform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      transform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
    };
  }

  getPageMaxWidth() {
    return this._pageMaxWidth || PAGE_MAX_WIDTH;
  }

  getNovelPadding(level) {
    const paddingValue = 7 - Number(level);
    return `0 ${paddingValue}% 80px ${paddingValue}%`;
  }

  getComicPadding() { return '0'; }

  getComicWidth(level) {
    return (Number(level) * 10) + 40;
  }

  getMaxWidth(contentType, viewerType) {
    if (contentType === ContentType.WEB_NOVEL || viewerType === ViewerType.SCROLL) {
      return `${this.getPageMaxWidth()}px`;
    }
    return 'none';
  }

  getFontSize(level) {
    const fontSizeUnit = 15;
    switch (Number(level)) {
      case 1: return fontSizeUnit * 0.8;
      case 2: return fontSizeUnit * 0.85;
      case 3: return fontSizeUnit * 0.9;
      case 4: return fontSizeUnit * 0.95;
      case 5: return fontSizeUnit;
      case 6: return fontSizeUnit * 1.15;
      case 7: return fontSizeUnit * 1.25;
      case 8: return fontSizeUnit * 1.4;
      case 9: return fontSizeUnit * 1.6;
      case 10: return fontSizeUnit * 1.8;
      case 11: return fontSizeUnit * 2.0;
      case 12: return fontSizeUnit * 2.3;
      default: return fontSizeUnit;
    }
  }

  getNovelLineHeight(level) {
    switch (level) {
      case 1:
        return 1.35;
      case 2:
        return 1.51;
      case 3:
        return 1.70;
      case 4:
        return 1.86;
      case 5:
        return 2.05;
      case 6:
        return 2.27;
      default:
        return 1.70;
    }
  }
}
const viewerHelper = new ViewerHelper();
export default viewerHelper;

