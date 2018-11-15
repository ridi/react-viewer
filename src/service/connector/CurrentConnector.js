import BaseConnector from './BaseConnector';
import {
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
  selectReaderSetting,
} from '../../redux/selector';
import { updateCurrent } from '../../redux/action';
import CalculationsConnector from './CalculationsConnector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import ReaderJsHelper from '../readerjs/ReaderJsHelper';
import { EMPTY_READ_LOCATION } from '../../constants/SettingConstants';

class CurrentConnector extends BaseConnector {
  getCurrent() {
    return selectReaderCurrent(this.getState());
  }

  updateCurrentOffset(offset) {
    const { viewType } = selectReaderSetting(this.getState());
    const contentIndex = CalculationsConnector.getIndexAtOffset(offset);

    const total = CalculationsConnector.getContentTotal(contentIndex);
    const position = (offset - CalculationsConnector.getStartOffset(contentIndex)) / total;
    let location = EMPTY_READ_LOCATION;
    try {
      location = ReaderJsHelper.getNodeLocationOfCurrentPage();
    } catch (e) {
      // ignore error
      console.warn(e);
    }

    this.dispatch(updateCurrent({
      contentIndex,
      offset,
      position,
      viewType,
      location,
    }));
  }

  restoreCurrentOffset() {
    const { viewType } = selectReaderSetting(this.getState());
    const { position, contentIndex, offset } = selectReaderCurrent(this.getState());

    if (!CalculationsConnector.isContentCalculated(contentIndex)) return;

    const total = CalculationsConnector.getContentTotal(contentIndex);
    const maxOffset = CalculationsConnector.getStartOffset(contentIndex) + (total - 1);
    const newOffset = Math.min(Math.round(position * total) + CalculationsConnector.getStartOffset(contentIndex), maxOffset);
    if (newOffset !== offset) {
      this.dispatch(updateCurrent({ offset: newOffset, viewType }));
    }
  }

  isOnFooter() {
    if (!CalculationsConnector.hasFooter) return false;
    if (!CalculationsConnector.isCompleted()) return false;

    const currentContentIndex = selectReaderCurrentContentIndex(this.getState());
    return currentContentIndex === FOOTER_INDEX;
  }
}

export default new CurrentConnector();
