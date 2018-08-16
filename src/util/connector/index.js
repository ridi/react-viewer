import CalculationsConnector from './CalculationsConnector';
import SettingConnector from './SettingConnector';
import CurrentConnector from './CurrentConnector';

export const connect = (store) => {
  CalculationsConnector.connect(store);
  SettingConnector.connect(store);
  CurrentConnector.connect(store);
};

export default {
  connect,
  calculations: CalculationsConnector,
  setting: SettingConnector,
  current: CurrentConnector,
};
