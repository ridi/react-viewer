import calculations from './CalculationsConnector';
import setting from './SettingConnector';
import current from './CurrentConnector';

export const connect = (store) => {
  calculations.connect(store);
  setting.connect(store);
  current.connect(store);
};

export default {
  connect,
  calculations,
  setting,
  current,
};
