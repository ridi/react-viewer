import Connector from '../Connector';
import ReadPositionHelper from './ReadPositionHelper';
import { calculatedPageViewer } from '../../redux/viewerScreen/ViewerScreen.action';
import { selectPageViewPagination, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import { ViewerType } from '../../constants/ViewerScreenConstants';
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

  _getScrollMode() {
    const viewerScreenSettings = selectViewerScreenSettings(this.store.getState());
    return viewerScreenSettings.viewerType === ViewerType.SCROLL;
  }

  _updateTotalPage() {
    const { dispatch, getState } = this.store;
    const width = screenWidth();
    const { totalPage: prevTotalPage } = selectPageViewPagination(getState());
    const pages = document.querySelector(this._targetSelector);
    let totalPage = Math.ceil((pages ? pages.scrollWidth : 0) / width) - 1;
    if (this._options.containExtraPage > 0) {
      totalPage += 1;
    }

    if (totalPage !== prevTotalPage) {
      const newPagination = {
        totalPage,
      };

      dispatch(calculatedPageViewer(newPagination));
    }
  }

  isEndingPage(page) {
    const { totalPage } = selectPageViewPagination(this.getState());
    const { viewerType } = selectViewerScreenSettings(this.getState());
    if (viewerType === ViewerType.PAGE && this._options.containExtraPage > 0) {
      return page >= totalPage;
    }
    return false;
  }

  updatePagination(restore = false) {
    if (this._getScrollMode()) {
      return;
    }

    const { getState } = this.store;
    const { currentPage } = selectPageViewPagination(getState());
    new AsyncTask(() => {
      setScrollTop(0);
      ReadPositionHelper.invalidateContext();
      this._updateTotalPage();
      if (!this.isEndingPage(currentPage)) {
        if (restore) {
          ReadPositionHelper.restorePosition();
        } else {
          ReadPositionHelper.updateChangedReadPosition();
        }
      }
    }).start(0);
  }
}
const pageCalculator = new PageCalculator();
export default pageCalculator;
