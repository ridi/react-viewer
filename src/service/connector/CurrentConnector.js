import BaseConnector from './BaseConnector';
import {
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
} from '../../redux/selector';
import { updateCurrent } from '../../redux/action';
import CalculationsConnector from './CalculationsConnector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';

class CurrentConnector extends BaseConnector {
  getCurrent() {
    return selectReaderCurrent(this.getState());
  }

  updateCurrent(current) {
    this.dispatch(updateCurrent(current));
  }

  isOnFooter() {
    if (!CalculationsConnector.hasFooter) return false;
    if (!CalculationsConnector.isCompleted()) return false;

    const currentContentIndex = selectReaderCurrentContentIndex(this.getState());
    return currentContentIndex === FOOTER_INDEX;
  }
}

export default new CurrentConnector();
