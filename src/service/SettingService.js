import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { EMPTY_READ_LOCATION, ViewType } from '../constants/SettingConstants';
import CalculationsConnector from './connector/CalculationsConnector';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import SettingConnector from './connector/SettingConnector';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { waitThenRun } from '../util/BrowserWrapper';
import {
  ContentFormat,
  selectReaderContentFormat,
  selectReaderContentsCalculations,
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
  selectReaderFooterCalculations,
  selectReaderIsInitContents,
  selectReaderIsReadyToRead,
  selectReaderSetting,
  setReadyToRead,
  updateCalculationsTotal,
  updateCurrent
} from '..';

class CurrentService extends BaseService {
  listeningEvents = {
    [Events.calculation.READY_TO_READ]: this.onReadyToRead.bind(this),
  };

  _restoreCurrentOffset() {
    const { viewType } = Connector.setting.getSetting();
    const { position, contentIndex, offset } = Connector.current.getCurrent();

    const total = CalculationsConnector.getContentTotal(contentIndex);
    const maxOffset = CalculationsConnector.getStartOffset(contentIndex) + (total - 1);
    const newOffset = Math.min(Math.round(position * total) + CalculationsConnector.getStartOffset(contentIndex), maxOffset);
    if (newOffset !== offset) {
      this.dispatch(updateCurrent({ offset: newOffset, viewType }));
    }
  }

  onReadyToRead() {

  }
}

export default new CurrentService();
