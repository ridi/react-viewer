import { LOG } from '../event/CoreEvents';
import StoreBuilder from '../util/StoreBuilder';

export const log$ = new StoreBuilder([])
  .fromEvent(LOG, (store, data) => {
    store.push({ ...data, timestamp: Date.now() });
    return store;
  })
  .build();
