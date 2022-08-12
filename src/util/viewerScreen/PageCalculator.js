import Connector from '../Connector';
import ReadPositionHelper from './ReadPositionHelper';
import { calculatedPageViewer, movePageViewer } from '../../redux/viewerScreen/ViewerScreen.action';
import { selectPageViewPagination, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import { ViewerType, INVALID_PAGE } from '../../constants/ViewerScreenConstants';
import { screenWidth, setScrollTop } from '../BrowserWrapper';
import AsyncTask from '../AsyncTask';
import { PAGE_VIEWER_SELECTOR } from '../../constants/StyledConstants';

class PageCalculator extends Connector {
  constructor() {
    super();
    this._targetSelector = PAGE_VIEWER_SELECTOR;
    this._options = {
      containExtraPage: 1,
    };
  }

  afterConnected() {
    this.updatePagination();
  }

  _getScrollMode() {
    const viewerScreenSettings = selectViewerScreenSettings(this.getState());
    return viewerScreenSettings.viewerType === ViewerType.SCROLL;
  }

  _updateTotalPage() {
    const width = screenWidth();
    const { totalPage: prevTotalPage } = selectPageViewPagination(this.getState());
    const pages = document.querySelector(this._targetSelector);
    let totalPage = Math.ceil((pages ? pages.scrollWidth : 0) / width);
    if (this._options.containExtraPage > 0) {
      totalPage += 1;
    }

    if (totalPage !== prevTotalPage) {
      const newPagination = {
        totalPage,
      };

      this.dispatch(calculatedPageViewer(newPagination));
    }
    return totalPage;
  }

  isEndingPage(page) {
    const { totalPage } = selectPageViewPagination(this.getState());
    const { viewerType } = selectViewerScreenSettings(this.getState());
    if (totalPage !== INVALID_PAGE && viewerType === ViewerType.PAGE && this._options.containExtraPage > 0) {
      return page >= totalPage;
    }
    return false;
  }

  updatePagination(restore = false) {
    if (this._getScrollMode()) {
      this.dispatch(calculatedPageViewer({ totalPage: INVALID_PAGE }));
      return;
    }

    const { currentPage } = selectPageViewPagination(this.getState());
    const isEndingPage = this.isEndingPage(currentPage);
    new AsyncTask(() => {
      setScrollTop(0);
      ReadPositionHelper.invalidateContext();
      const totalPage = this._updateTotalPage();
      if (!isEndingPage) {
        if (restore) {
          ReadPositionHelper.restorePosition();
        } else {
          ReadPositionHelper.updateChangedReadPosition();
        }
      } else {
        this.dispatch(movePageViewer(totalPage));
      }
    }).start(0);
  }
}
const pageCalculator = new PageCalculator();
export default pageCalculator;
