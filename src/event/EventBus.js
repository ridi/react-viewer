import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { LOG } from './CoreEvents';
import Logger from '../util/Logger';

export default class EventBus {
  static _events = {};

  _subject = null;
  _eventType = null;

  static from(eventType) {
    if (!EventBus._events[eventType]) {
      EventBus._events[eventType] = new EventBus(eventType);
    }
    return EventBus._events[eventType];
  }

  static emit(eventType, data) {
    EventBus.from(eventType).emit(data);
  }

  static on(eventType, next) {
    EventBus.from(eventType).on(next);
  }

  constructor(eventType) {
    this._eventType = eventType;
    this._subject = (new Subject()).pipe(share());
  }

  toObservable() {
    return this._subject;
  }

  on(next) {
    const observer = (typeof next === 'function') ? ({
      next: ({ data }) => next(data),
      error: error => Logger.error(error),
      complete: () => Logger.debug(`${this._eventType.toString()} was completed.`),
    }) : next;
    return this._subject.subscribe(observer);
  }

  emit(data) {
    if (this._eventType !== LOG) {
      EventBus.emit(LOG, { name: this._eventType.description, data });
    }
    this._subject.next({ type: this._eventType, data });
  }
}
