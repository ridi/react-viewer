import Connector from '../Connector';
import { calculatedPageViewer } from '../../redux/viewerScreen/ViewerScreen.action';
import { selectPageViewPagination, selectViewerScreenSettings } from '../../redux/viewerScreen/ViewerScreen.selector';
import { ViewerType } from '../../constants/ViewerScreenConstants';
import { screenWidth } from '../BrowserWrapper';
import { updateObject } from '../Util';

class PageCalculator extends Connector {
  constructor() {
    super();
    this._targetSelector = '#viewer_page_contents .pages';
    this._option = {
      containExtraPage: 1,
    };
  }

  setOption(option) {
    this._option = updateObject(this._option, option);
  }

  isEndingPage(page) {
    const { totalPage } = selectPageViewPagination(this.getState());
    const { viewerType } = selectViewerScreenSettings(this.getState());
    if (viewerType === ViewerType.PAGE && this._option.containExtraPage > 0) {
      return page >= totalPage;
    }
    return false;
  }

  updatePagination() {
    const { dispatch } = this.store;
    const { currentPage } = selectPageViewPagination(this.getState());
    const width = screenWidth();
    const pages = document.querySelector(this._targetSelector);
    let totalPage = Math.ceil((pages ? pages.scrollWidth : 0) / width);
    if (this._option.containExtraPage > 0) {
      totalPage += 1;
    }

    const newPagination = {
      totalPage,
      currentPage: Math.min(totalPage, currentPage),
    };

    dispatch(calculatedPageViewer(newPagination));
  }
}
const pageCalculator = new PageCalculator();
export default pageCalculator;
