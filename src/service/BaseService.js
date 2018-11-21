import EventBus from '../event/EventBus';
import Logger from '../util/Logger';

export default class BaseService {
  subs = [];
  listeningEvents = {}; // event: observer

  load() {
    this.subs = Object.getOwnPropertySymbols(this.listeningEvents)
      .map(eventName => EventBus.from(eventName).on(this.listeningEvents[eventName]));
    Logger.debug(`${this.constructor.name} service was loaded.`);
  }

  unload() {
    this.subs.forEach(subs => subs.unsubscribe());
  }

  afterLoaded() {}
  beforeUnloaded() {}
}
