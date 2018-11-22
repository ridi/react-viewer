import calculations from './CalculationsConnector';
import setting from './SettingConnector';
import current from './CurrentConnector';
import BaseConnector from './BaseConnector';
import selection from './SelectionConnector';
import { selectReader, selectReaderIsAllCalculated, selectReaderIsLoaded } from '../../redux/selector';

const core = new (class CoreConnector extends BaseConnector {
  isReaderLoaded() {
    return selectReaderIsLoaded(this.getState());
  }

  isReaderAllCalculated() {
    return selectReaderIsAllCalculated(this.getState());
  }

  getReaderState() {
    return selectReader(this.getState());
  }
})();

export const connect = (store) => {
  core.connect(store);
  calculations.connect(store);
  setting.connect(store);
  current.connect(store);
  selection.connect(store);
};

export default {
  core,
  connect,
  calculations,
  setting,
  current,
  selection,
};
