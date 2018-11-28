import { merge } from 'rxjs';
import EventBus from '../event/EventBus';
import Logger from '../util/Logger';

export default class BaseService {
  listeningEvents = {}; // event: observer
  _subscriptions = [];

  load() {
    Object.getOwnPropertySymbols(this.listeningEvents)
      .forEach(eventName => EventBus.on(eventName, this.listeningEvents[eventName], this));
    Logger.debug(`${this.constructor.name} service was loaded.`);
  }

  unload() {
    EventBus.offByTarget(this);
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  afterLoaded() {}
  beforeUnloaded() {}

  connectEvents(connectedTo, ...events) {
    const obs$ = merge(...events.map(eventType => EventBus.asObservable(eventType)));
    const subscription = connectedTo(obs$);
    if (subscription) {
      this._subscriptions.push(subscription);
    }
  }
}
