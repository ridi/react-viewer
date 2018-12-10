import EventBus from '../event/EventBus';
import Logger from '../util/Logger';

export default class BaseService {
  _subscriptions = [];

  load() {
    Logger.debug(`${this.constructor.name} service was loaded.`);
  }

  unload() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  afterLoaded() {}
  beforeUnloaded() {}

  connectEvents(connectedTo, ...events) {
    const obs$ = [...events.map(eventType => EventBus.asObservable(eventType))];
    const subscription = connectedTo(...obs$);
    if (subscription) {
      this._subscriptions.push(subscription);
    }
  }
}
