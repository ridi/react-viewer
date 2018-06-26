import CalculationsConnector from './CalculationsConnector';
import SettingConnector from './SettingConnector';

export const connect = (store) => {
  CalculationsConnector.connect(store);
  SettingConnector.connect(store);
};

export default {
  connect,
  calculations: CalculationsConnector,
  setting: SettingConnector,
};
