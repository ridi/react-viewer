import BaseConnector from './BaseConnector';
import {
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
} from '../../redux/selector';
import { updateCurrent } from '../../redux/action';
import CalculationsConnector from './CalculationsConnector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import { ViewType } from '../../constants';
import SettingConnector from './SettingConnector';

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

  getLeftOffset() {
    const { viewType } = SettingConnector.getSetting();
    if (viewType !== ViewType.PAGE) return 0;
    const containerWidth = SettingConnector.getContainerWidth();
    const columnGap = SettingConnector.getColumnGap();
    const { offset, contentIndex } = this.getCurrent();
    const { offset: startOffset } = CalculationsConnector.getCalculation(contentIndex);
    const localOffset = offset - startOffset;

    return (localOffset * (containerWidth + columnGap));
  }
}

export default new CurrentConnector();
