import { BehaviorSubject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';
import EventBus from '../event/EventBus';

export default class StoreBuilder {
  _reducers = {};
  _notifyEvent = null;
  _initialValue = null;

  constructor(initialValue = null) {
    this._initialValue = initialValue;
    return this;
  }

  fromEvent(eventType, reducer = (store, data) => data) {
    this._reducers[eventType] = reducer;
    return this;
  }

  toEvent(eventType) {
    this._notifyEvent = eventType;
  }

  build() {
    const obs$ = new BehaviorSubject(this._initialValue);

    Object.getOwnPropertySymbols(this._reducers)
      .forEach(type => EventBus.asObservable(type).subscribe(obs$));

    return obs$.pipe(
      scan((store, { type, data }) => {
        if (this._reducers[type]) {
          return this._reducers[type](store, data);
        }
        return store;
      }, this._initialValue),
      tap((data) => {
        if (this._notifyEvent) {
          EventBus.emit(this._notifyEvent, data);
        }
      }),
    );
  }
}
