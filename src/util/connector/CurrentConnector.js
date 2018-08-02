import Connector from '../Connector';
import {
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
  selectReaderSetting,
} from '../../redux/selector';
import { updateCurrent } from '../../redux/action';
import CalculationsConnector from './CalculationsConnector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';

class CurrentConnector extends Connector {
  setReaderJs(readerJs) {
    this.readerJs = readerJs;
  }

  getCurrent() {
    return selectReaderCurrent(this.getState());
  }

  updateCurrentPosition(offset) {
    if (!CalculationsConnector.isCompleted()) return;

    const { viewType } = selectReaderSetting(this.getState());
    const contentIndex = CalculationsConnector.getIndexAtOffset(offset);

    const total = CalculationsConnector.getTotal(contentIndex);
    const position = (offset - CalculationsConnector.getStartOffset(contentIndex)) / total;
    const location = this.readerJs.getNodeLocationOfCurrentPage();
    this.dispatch(updateCurrent({
      contentIndex,
      offset,
      position,
      viewType,
      location,
    }));
  }

  restoreCurrentOffset() {
    if (!CalculationsConnector.isCompleted()) return;

    const { viewType } = selectReaderSetting(this.getState());
    const { position, contentIndex } = selectReaderCurrent(this.getState());

    const total = CalculationsConnector.getTotal(contentIndex);
    const maxOffset = CalculationsConnector.getStartOffset(contentIndex) + (total - 1);
    const offset = Math.min(Math.round(position * total) + CalculationsConnector.getStartOffset(contentIndex), maxOffset);
    this.dispatch(updateCurrent({ offset, viewType }));
  }

  isOnFooter() {
    if (!CalculationsConnector.getHasFooter()) return false;
    if (!CalculationsConnector.isCompleted()) return false;

    const currentContentIndex = selectReaderCurrentContentIndex(this.getState());
    return currentContentIndex === FOOTER_INDEX;
  }
}

export default new CurrentConnector();
