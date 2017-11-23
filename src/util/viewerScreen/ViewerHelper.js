import Connector from '../Connector';
import { selectPageViewPagination } from '../../redux/viewerScreen/ViewerScreen.selector';
import { documentClientWidth, documentClientHeight, scrollTo, scrollLeft } from '../BrowserWrapper';
import {
  DEFAULT_PADDING_TOP,
  MAX_PADDING_LEVEL,
  MIN_PADDING_BOTTOM,
  PAGE_MAX_WIDTH,
  PAGE_VIEWER_SELECTOR,
} from '../../constants/StyledConstants';

class ViewerHelper extends Connector {
  afterConnected() {
    const {
      paddingTop = DEFAULT_PADDING_TOP,
      pageMaxWidth = PAGE_MAX_WIDTH,
      pageViewerSelector = PAGE_VIEWER_SELECTOR,
    } = this._options;

    this._targetSelector = pageViewerSelector;
    this._paddingTop = paddingTop;
    this._pageMaxWidth = pageMaxWidth;
  }

  getScrollStyle() {
    return {
      paddingTop: this._paddingTop,
    };
  }

  getPageStyle(paddingLevel) {
    const width = documentClientWidth();
    const height = documentClientHeight();

    const maxGap = width > this._pageMaxWidth ? ((width - this._pageMaxWidth) / 2) : 0;
    const paddingHorizontal = parseInt(width * 0.01 * (MAX_PADDING_LEVEL - paddingLevel), 10);
    let paddingVertical = parseInt(width * 0.10, 10);
    paddingVertical = paddingVertical > MIN_PADDING_BOTTOM ? paddingVertical : MIN_PADDING_BOTTOM;
    const columnGap = (paddingHorizontal + maxGap) * 2;

    return {
      WebkitColumnWidth: `${width}px`,
      columnWidth: `${width}px`,
      WebkitColumnGap: columnGap,
      columnGap,
      paddingTop: this._paddingTop,
      paddingBottom: paddingVertical,
      paddingLeft: paddingHorizontal,
      paddingRight: paddingHorizontal,
      boxSizing: 'border-box',
      height,
    };
  }

  getComicPageStyle() {
    const width = documentClientWidth();
    const height = documentClientHeight();

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
    };
  }

  shouldSlideToPage(nextPage) {
    const { getState } = this.store;
    const pageView = selectPageViewPagination(getState());
    const { totalPage } = pageView;
    return totalPage > nextPage && (nextPage - 1) * documentClientWidth() !== scrollLeft();
  }

  slideToPage(nextPage) {
    const leftOffset = (nextPage - 1) * documentClientWidth();
    scrollTo(leftOffset, 0);
  }
}
const viewerHelper = new ViewerHelper();
export default viewerHelper;

