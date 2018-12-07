import { BehaviorSubject } from 'rxjs';
import EventBus from '../event/EventBus';

export default class BaseStore {
  _obs$ = null;
  _subscriptions = [];

  constructor(initialValue = null) {
    this._obs$ = new BehaviorSubject(initialValue);
  }

  load() {

  }

  unload() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  asObservable() {
    return this._obs$;
  }

  next(value) {
    this._obs$.next(value);
  }

  connectEvents(connectedTo, ...events) {
    const obs$ = [...events.map(eventType => EventBus.asObservable(eventType))];
    const subscription = connectedTo(...obs$);
    if (subscription) {
      this._subscriptions.push(subscription);
    }
  }
}
