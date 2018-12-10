import { Subject } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { LOG } from './Events';
import Logger from '../util/Logger';

const UNKNOWN_TARGET = 'unknown';

export default class EventBus {
  static _events = {};

  _subject = null;
  _eventType = null;
  _targets = new Map();

  static from(eventType) {
    if (!EventBus._events[eventType]) {
      EventBus._events[eventType] = new EventBus(eventType);
    }
    return EventBus._events[eventType];
  }

  static asObservable(eventType) {
    return EventBus.from(eventType).asObservable();
  }

  static emit(eventType, data) {
    EventBus.from(eventType).emit(data);
  }

  static on(eventType, next, target = UNKNOWN_TARGET) {
    EventBus.from(eventType).on(next, target);
  }

  static off(eventType, target = UNKNOWN_TARGET) {
    EventBus.from(eventType).off(target);
  }

  static offByTarget(target = UNKNOWN_TARGET) {
    Object.getOwnPropertySymbols(EventBus._events).forEach(eventType => EventBus.off(eventType, target));
  }

  static completeAll() {
    Object.getOwnPropertySymbols(EventBus._events).forEach((eventType) => {
      EventBus._events[eventType].complete();
      delete EventBus._events[eventType];
    });
  }

  constructor(eventType) {
    this._eventType = eventType;
    this._subject = (new Subject()).pipe(
      tap(({ type, data }) => Logger.debugGroup(`✉️ ${type.description}`, data)),
      share(),
    );
  }

  _getSubscriptions(target) {
    let subscriptions = this._targets.get(target);
    if (!subscriptions) {
      subscriptions = [];
      this._targets.set(target, subscriptions);
    }
    return subscriptions;
  }

  _removeTarget(target) {
    this._targets.delete(target);
  }

  asObservable() {
    return this._subject;
  }

  on(next, target = UNKNOWN_TARGET) {
    const observer = {
      next: ({ data }) => next(data),
      error: error => Logger.error(error),
      complete: () => Logger.debug(`${this._eventType.toString()} was completed.`),
    };
    const subscription = this._subject.subscribe(observer);
    this._getSubscriptions(target).push(subscription);
    return subscription;
  }

  off(target = UNKNOWN_TARGET) {
    this._getSubscriptions(target).forEach(subscription => subscription.unsubscribe());
    this._removeTarget(target);
  }

  complete() {
    this._subject.complete();
  }

  emit(data) {
    if (this._eventType !== LOG) {
      EventBus.emit(LOG, { name: this._eventType.description, data });
    }
    this._subject.next({ type: this._eventType, data });
  }
}
