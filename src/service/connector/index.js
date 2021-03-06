import calculations from './CalculationsConnector';
import setting from './SettingConnector';
import current from './CurrentConnector';
import BaseConnector from './BaseConnector';
import content from './ContentConnector';

import { selectReader, selectReaderIsAllCalculated, selectReaderIsLoaded } from '../../redux/selector';
import { load } from '../../redux/action';

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

  restoreReaderState(state) {
    this.store.dispatch(load(state));
  }
})();

export const connect = (store) => {
  core.connect(store);
  calculations.connect(store);
  setting.connect(store);
  current.connect(store);
  content.connect(store);
};

export default {
  core,
  connect,
  calculations,
  setting,
  current,
  content,
};
