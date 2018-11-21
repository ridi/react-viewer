import StoreBuilder from '../util/StoreBuilder';
import { Events } from '../event';

export const calculation$ = new StoreBuilder([])
  .fromEvent(Events.calculation.CALCULATION_INVALIDATE, (store, { contentNumber }) => Array(contentNumber))
  .fromEvent(Events.calculation.CALCULATION_SET, (store, { index, calc }) => {
    store[index] = { index, ...calc };
    return [...store];
  })
  .build();

export const currentCalculationTargets$ = new StoreBuilder([])
  .fromEvent(Events.calculation.WITH_CALCULATION_TARGETS)
  .build();

export const contentsInView = new StoreBuilder([])
  .fromEvent(Events.calculation.WITH_CONTENTS_IN_VIEW)
  .build();
