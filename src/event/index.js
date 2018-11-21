import EventBus from './EventBus';

import * as calculation from './CalculationEvents';
import * as content from './ContentEvents';
import * as core from './CoreEvents';

export const Events = {
  calculation,
  content,
  core,
};

export default EventBus;
