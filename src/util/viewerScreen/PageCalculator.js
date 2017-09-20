import Connector from '../Connector';
import { calculatedPageViewer } from '../../redux/viewerScreen/ViewerScreen.action';
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

  isEndingPage(page, totalPage) {
    if (this._option.containExtraPage > 0) {
      return page === totalPage;
    }
    return false;
  }

  updatePagination() {
    const { getState, dispatch } = this.store;
    const width = screenWidth();
    const pages = document.querySelector(this._targetSelector);
    let totalPage = Math.ceil((pages ? pages.scrollWidth : 0) / width);
    if (this._option.containExtraPage > 0) {
      totalPage += 1;
    }

    const newPage = {
      totalPage,
    };

    dispatch(calculatedPageViewer(newPage));
  }
}
const pageCalculator = new PageCalculator();
export default pageCalculator;
