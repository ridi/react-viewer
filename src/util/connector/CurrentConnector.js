import Connector from '../Connector';
import {
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
  selectReaderSetting,
} from '../../redux/selector';
import { updateCurrent } from '../../redux/action';
import CalculationsConnector from './CalculationsConnector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import ReaderJsHelper from '../ReaderJsHelper';
import { READERJS_CONTENT_WRAPPER, ViewType, EMPTY_READ_LOCATION } from '../../constants/SettingConstants';

class CurrentConnector extends Connector {
  constructor() {
    super();
    this.readerJs = null;
  }

  setReaderJs() {
    const { viewType } = selectReaderSetting(this.getState());
    if (this.readerJs) {
      this.readerJs.unmount();
      this.readerJs = null;
    }
    const node = document.querySelector(`.${READERJS_CONTENT_WRAPPER}`);
    if (node) {
      this.readerJs = new ReaderJsHelper(node, viewType === ViewType.SCROLL);
      const location = this.readerJs.getNodeLocationOfCurrentPage();
      this.dispatch(updateCurrent({ location }));
    }
  }

  updateCurrentPosition(offset) {
    if (!CalculationsConnector.isCompleted()) return;

    const { viewType } = selectReaderSetting(this.getState());
    const contentIndex = CalculationsConnector.getIndexAtOffset(offset);

    const total = CalculationsConnector.getTotal(contentIndex);
    const position = (offset - CalculationsConnector.getStartOffset(contentIndex)) / total;
    let location = EMPTY_READ_LOCATION;
    if (this.readerJs) {
      location = this.readerJs.getNodeLocationOfCurrentPage();
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
