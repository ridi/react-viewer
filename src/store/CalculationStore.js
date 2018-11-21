import StoreBuilder from '../util/StoreBuilder';
import { CALCULATION_INVALIDATE, CALCULATION_SET, WITH_CALCULATION_TARGETS, WITH_CONTENTS_IN_VIEW } from '../event/CalculationEvents';

export const calculation$ = new StoreBuilder([])
  .fromEvent(CALCULATION_INVALIDATE, (store, { contentNumber }) => Array(contentNumber))
  .fromEvent(CALCULATION_SET, (store, { index, calc }) => {
    store[index] = { index, ...calc };
    return [...store];
  })
  .build();

export const currentCalculationTargets$ = new StoreBuilder([])
  .fromEvent(WITH_CALCULATION_TARGETS)
  .build();

export const contentsInView = new StoreBuilder([])
  .fromEvent(WITH_CONTENTS_IN_VIEW)
  .build();
