import EventBus from './EventBus';

import * as calculation from './CalculationEvents';
import * as content from './ContentEvents';
import * as core from './CoreEvents';
import * as setting from './SettingEvents';

export const Events = {
  calculation,
  content,
  core,
  setting,
};

export default EventBus;
