import EventBus from '../event/EventBus';
import BaseService from './BaseService';
import { RESIZE, SCROLL } from '../event/CoreEvents';
import { CALCULATION_INVALIDATE } from '../event/CalculationEvents';
import Connector from './connector';
import { EMPTY_READ_LOCATION } from '../constants/SettingConstants';
import CalculationsConnector from './connector/CalculationsConnector';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import SettingConnector from './connector/SettingConnector';

class CalculationService extends BaseService {
  listeningEvents = {
    // setting_updated
    // [RESIZE]: this.calculationNeeded.bind(this),
    // [CONTENT_LOADED]: this.calculationNeeded.bind(this),
    // [CALCULATION_INVALIDATE]: this.calculationStart.bind(this),
    [SCROLL]: this.onScrolled.bind(this),
  };

  calculationNeeded({ contentNumber }) {
    EventBus.emit(CALCULATION_INVALIDATE, contentNumber);
  }

  async calculationStart() {

  }

  _updateCurrentOffset(viewType, offset) {
    const contentIndex = CalculationsConnector.getIndexAtOffset(offset);
    const total = CalculationsConnector.getContentTotal(contentIndex);
    const position = (offset - CalculationsConnector.getStartOffset(contentIndex)) / total;
    let location = EMPTY_READ_LOCATION;
    try {
      location = ReaderJsHelper.get(contentIndex).getNodeLocationOfCurrentPage();
    } catch (e) {
      // ignore error
      console.warn(e);
    }

    // TODO Replace this with emitting store event
    Connector.current.updateCurrentOffset({
      contentIndex,
      offset,
      position,
      location,
      viewType,
    });
  }

  onScrolled({ scrollY }) {
    const { viewType } = SettingConnector.getSetting();
    this._updateCurrentOffset(viewType, scrollY);
  }
}

export default new CalculationService();
