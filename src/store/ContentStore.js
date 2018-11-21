import { merge } from 'rxjs';
import { scan, map } from 'rxjs/operators';
import { Events } from '../event';
import StoreBuilder from '../util/StoreBuilder';

/**
 * content {
 *   index
 *   uri: string?
 *   content: string?
 *   isLoaded: bool (resource 포함)
 *   isCalculated: bool
 *   isReadyToRead: bool
 *   calculationOffset: number
 *   calculationTotal: number
 * }
 */

class CollectionStore {
  _stores = null;
  _storeObservable = null;

  constructor(size, event, reducer, initialDataGenerator = () => null) {
    this._stores = Array(size).map(
      (_, index) => new StoreBuilder(initialDataGenerator(index)).fromEvent(event, reducer).build(),
    );
    this._storeObservable = merge(
      ...this._stores.map((obs$, index) => obs$.pipe(map(data => ({ index, data })))),
    ).pipe(
      scan((store, { index, data }) => {
        store.splice(index, 1, data);
        return store;
      }, Array(size)),
    );
  }

  _getObserver(index) {
    if (typeof index !== 'number') {
      return this._storeObservable;
    }
    return this._stores[index];
  }

  subscribe(observer, index = null) {
    this._getObserver(index).subscribe(observer);
  }

  toPromise(index = null) {
    this._getObserver(index).toPromise();
  }

  get(index = null) {
    let result;
    this.toPromise(index).then((data) => { result = data; });
    return result;
  }
}

export const contentMeta$ = new StoreBuilder([])
  .fromEvent(Events.content.META_SET)
  .build();

export const contents$ = new StoreBuilder([])
  .fromEvent(Events.content.WITH_CONTENT)
  .fromEvent(Events.content.WITH_CONTENTS)
  .build();

export const content$ = (index) => contents$.pipe(
  map((contents) => contents.filter(content => index === content.index)),
);

content$(index).subscribe()
