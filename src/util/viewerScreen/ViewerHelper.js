import Connector from '../Connector';
import { selectPageViewPagination } from '../../redux/viewerScreen/ViewerScreen.selector';
import { screenHeight, screenWidth } from '../BrowserWrapper';


const PAGE_MAX_WIDTH = 600;
const MIN_PADDING_BOTTOM = 50;
const MAX_PADDING_LEVEL = 6;
const DEFAULT_PADDING_TOP = 35;
const PAGE_VIEWER_SELECTOR = '#viewer_page_contents .pages';

class ViewerHelper extends Connector {
  constructor() {
    super();
    this._targetSelector = PAGE_VIEWER_SELECTOR;
  }

  getScrollStyle() {
    return {
      paddingTop: DEFAULT_PADDING_TOP,
    };
  }

  getPageStyle(paddingLevel) {
    const { getState } = this.store;
    const width = screenWidth();
    const height = screenHeight();
    const pageView = selectPageViewPagination(getState());

    const { currentPage } = pageView;

    const maxGap = width > PAGE_MAX_WIDTH ? ((width - PAGE_MAX_WIDTH) / 2) : 0;
    const paddingHorizontal = parseInt(width * 0.01 * (MAX_PADDING_LEVEL - paddingLevel), 10);
    let paddingVertical = parseInt(width * 0.10, 10);
    paddingVertical = paddingVertical > MIN_PADDING_BOTTOM ? paddingVertical : MIN_PADDING_BOTTOM;
    const columnGap = (paddingHorizontal + maxGap) * 2;

    return {
      WebkitColumnWidth: `${width}px`,
      columnWidth: `${width}px`,
      WebkitColumnGap: columnGap,
      columnGap,
      paddingTop: DEFAULT_PADDING_TOP,
      paddingBottom: paddingVertical,
      paddingLeft: paddingHorizontal,
      paddingRight: paddingHorizontal,
      height: height - paddingVertical,
      // WebkitTransition: 'transform 0s',
      // transition: 'transform 0s',
      WebkitTransform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      transform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      // 'animation': 'pageChange 2s 1',
      // 'overflowX': 'scroll',
    };
  }

  getComicPageStyle() {
    const { getState } = this.store;
    const width = screenWidth();
    const height = screenHeight();
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
      // WebkitTransition: 'transform 0s',
      // transition: 'transform 0s',
      WebkitTransform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      transform: `translate(${(-(currentPage - 1)) * width}px, 0px)`,
      // 'animation': 'pageChange 2s 1',
      // 'overflowX': 'scroll',
    };
  }
}
const viewerHelper = new ViewerHelper();
export default viewerHelper;

