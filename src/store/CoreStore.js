import { Events } from '../event';
import StoreBuilder from '../util/StoreBuilder';

export const log$ = new StoreBuilder([])
  .fromEvent(Events.core.LOG, (store, data) => {
    store.push({ ...data, timestamp: Date.now() });
    return store;
  })
  .build();
